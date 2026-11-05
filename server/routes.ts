import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { randomBytes } from "crypto";
import { storage } from "./storage";
import {
  insertMemberSchema, insertContactMessageSchema, insertNewsletterSubscriberSchema,
  insertOpportunitySchema, insertPartnerSchema, insertTrainingSchema,
  insertNewsArticleSchema, insertEventSchema, insertAchievementSchema,
  insertThunderbirdApplicationSchema, insertCandidateSchema, insertVoteSchema,
  insertAwsRestartApplicationSchema, insertPlanActivitySchema, insertActivityReportSchema,
  AWS_RESTART_APPLICATION_DEADLINE, insertInvestReadyApplicationSchema, INVEST_READY_DEADLINE
} from "../shared/schema";
import { z } from "zod";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import rateLimit from "express-rate-limit";
import { pool, sql } from "./db";
import { neon } from "@neondatabase/serverless";
import { sendNotificationEmail, sendAutoReplyEmail, sendMassEmail, debugSmtpConnection, sendPersonalizedMemberEmails } from "./email";

// Migration auto-appliquée (idempotente) : colonne vidéo des candidatures AWS re/Start.
let awsVideoColumnEnsured: Promise<void> | null = null;
function ensureAwsVideoColumn(): Promise<void> {
  if (!awsVideoColumnEnsured) {
    awsVideoColumnEnsured = sql`ALTER TABLE "aws_restart_applications" ADD COLUMN IF NOT EXISTS "video_url" text`
      .then(() => sql`ALTER TABLE "aws_restart_applications" ADD COLUMN IF NOT EXISTS "photo_url" text`)
      .then(() => undefined)
      .catch((err) => {
        awsVideoColumnEnsured = null; // réessaiera à la prochaine candidature
        throw err;
      });
  }
  return awsVideoColumnEnsured;
}
declare module "express-session" {
  interface SessionData {
    isAdmin: boolean;
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.isAdmin) {
    return res.status(401).json({ error: "Non autorisé" });
  }
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  const isVercel = process.env.VERCEL === "1" || !pool;
  let sessionStore;

  if (isVercel) {
    sessionStore = new session.MemoryStore();
  } else {
    const PgStore = connectPgSimple(session);
    sessionStore = new PgStore({ pool, createTableIfMissing: true });
  }

  app.set("trust proxy", 1);

  // ─── Security Headers Middleware ───────────────────────────────────────────
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://www.gstatic.com https://www.google.com https://translate.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.gstatic.com https://www.google.com https://translate.googleapis.com; font-src 'self' data: https://fonts.gstatic.com https://www.gstatic.com; img-src 'self' data: https: https://www.google.com https://translate.google.com; connect-src 'self' https:;"
    );
    next();
  });

  // ─── Cache CDN Vercel pour les lectures publiques ────────────────────────────
  // Réduit massivement le transfert réseau de la base Neon : les réponses publiques
  // (listes avec images en base64, galerie) sont servies par le CDN pendant 10 min.
  app.use(
    [
      "/api/trainings", "/api/news", "/api/events", "/api/achievements",
      "/api/partners", "/api/opportunities", "/api/plan-activities",
      "/api/members/gallery", "/api/members/stats", "/api/elections/candidates",
    ],
    (req: Request, res: Response, next: NextFunction) => {
      if (req.method === "GET") {
        res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=86400");
      }
      next();
    }
  );

  // ─── Rate Limiters ─────────────────────────────────────────────────────────
  // S'assure dès le démarrage que les colonnes vidéo/photo des candidatures AWS existent.
  ensureAwsVideoColumn().catch((e) => console.error("ensureAwsVideoColumn au démarrage:", e));

  // Création idempotente de la table des candidatures Invest Ready Tchad.
  let investReadyTableEnsured: Promise<void> | null = null;
  function ensureInvestReadyTable(): Promise<void> {
    if (!investReadyTableEnsured) {
      investReadyTableEnsured = sql`CREATE TABLE IF NOT EXISTS "invest_ready_applications" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
        "startup_name" text NOT NULL,
        "sector" text NOT NULL,
        "founding_year" text NOT NULL,
        "description" text NOT NULL,
        "website" text,
        "stage" text NOT NULL,
        "revenue_12m" text,
        "funding_amount" text NOT NULL,
        "funding_timeline" text NOT NULL,
        "founder_first_name" text NOT NULL,
        "founder_last_name" text NOT NULL,
        "founder_dob" text NOT NULL,
        "founder_gender" text NOT NULL,
        "founder_phone" text NOT NULL,
        "founder_email" text NOT NULL,
        "second_first_name" text,
        "second_last_name" text,
        "second_dob" text,
        "second_gender" text,
        "id_file_name" text NOT NULL,
        "id_file_data" text NOT NULL,
        "deck_file_name" text,
        "deck_file_data" text,
        "presence_commitment" boolean NOT NULL,
        "data_consent" boolean NOT NULL,
        "status" text NOT NULL DEFAULT 'pending',
        "created_at" timestamp DEFAULT now()
      )`
        .then(() => undefined)
        .catch((err) => {
          investReadyTableEnsured = null;
          throw err;
        });
    }
    return investReadyTableEnsured;
  }
  ensureInvestReadyTable().catch((e) => console.error("ensureInvestReadyTable au démarrage:", e));

  // Au Tchad, des centaines d'utilisateurs mobiles partagent la même adresse IP
  // (NAT des opérateurs) : une limite trop basse bloque des candidats légitimes.
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 60,
    message: { error: "Trop de requêtes depuis cette adresse IP, veuillez réessayer plus tard." },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Limiteur dédié aux candidatures en période d'appel : très permissif par IP
  // (la protection anti-doublon se fait par email, côté base de données).
  const applicationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: { error: "Trop de requêtes, veuillez réessayer dans quelques minutes." },
    standardHeaders: true,
    legacyHeaders: false,
  });

  // Strict limiter for election endpoints - only 3 attempts per 30 min
  const electionLimiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    max: 3,
    message: { error: "Trop de tentatives. Réessayez dans 30 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
  });

  // General API limiter - 100 req / 15 min
  const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Trop de requêtes." },
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api/", generalLimiter);

  app.use(
    session({
      store: sessionStore,
      secret: process.env.SESSION_SECRET || randomBytes(32).toString("hex"),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000
      },
    })
  );

  // ─── Email Diagnostic Route (Admin Only) ───────────────────────────────────
  app.get("/api/admin/test-email", requireAdmin, async (_req, res) => {
    try {
      const result = await debugSmtpConnection();
      res.json({
        timestamp: new Date().toISOString(),
        smtpUser: process.env.SMTP_USER || "NOT SET",
        smtpPassPresent: !!process.env.SMTP_PASS,
        result
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/sitemap.xml", async (_req, res) => {
    const baseUrl = "https://sayctchad.org";
    const pages = [
      { url: "/", priority: "1.0", changefreq: "weekly" },
      { url: "/a-propos", priority: "0.8", changefreq: "monthly" },
      { url: "/programmes", priority: "0.8", changefreq: "monthly" },
      { url: "/programmes/aws-restart", priority: "0.9", changefreq: "weekly" },
      { url: "/programmes/invest-ready-tchad", priority: "0.9", changefreq: "weekly" },
      { url: "/programmes/thunderbird", priority: "0.8", changefreq: "weekly" },
      { url: "/formations", priority: "0.8", changefreq: "weekly" },
      { url: "/evenements", priority: "0.7", changefreq: "weekly" },
      { url: "/actualites", priority: "0.9", changefreq: "daily" },
      { url: "/contact", priority: "0.6", changefreq: "monthly" },
      { url: "/rejoindre", priority: "0.8", changefreq: "monthly" },
      { url: "/opportunites", priority: "0.9", changefreq: "daily" },
    ];
    const today = new Date().toISOString().split("T")[0];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>${baseUrl}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join("\n")}
</urlset>`;
    res.set("Content-Type", "application/xml");
    res.send(xml);
  });

  app.post("/api/members", apiLimiter, async (req, res) => {
    try {
      const validatedData = insertMemberSchema.parse(req.body);
      const existingMember = await storage.getMemberByEmailCaseInsensitive(validatedData.email);
      if (existingMember) {
        return res.status(400).json({ 
          error: "Un membre avec cet email existe déjà",
          code: "MEMBER_EXISTS",
          membershipId: existingMember.membershipId // Provide this so they know they are registered
        });
      }
      const member = await storage.createMember(validatedData);

      // Non-blocking email notifications
      sendNotificationEmail(
        "Nouveau Membre SAYC - SAYC Tchad",
        `Nouvelle adhésion de ${member.firstName} ${member.nomSpecifiqueUnique} (${member.email}).\nVille: ${member.city}\nTéléphone: ${member.phone}\nID Membre: ${member.membershipId}\nMotivation: ${member.motivation || 'Non spécifiée'}`
      );

      sendAutoReplyEmail(
        member.email,
        "Confirmation de votre adhésion - SAYC Tchad",
        `Bonjour ${member.firstName},\n\nNous confirmons la bonne réception de votre demande d'adhésion au Smart Africa Youth Chapter Tchad (SAYC Tchad).\n\nVotre ID Membre est : ${member.membershipId}\n\nNotre équipe étudiera votre demande et vous contactera très prochainement.\n\nCordialement,\nL'équipe SAYC Tchad`
      );

      res.status(201).json(member);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Données invalides", details: error.errors });
      }
      console.error("Error creating member:", error);
      res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
  });

  app.post("/api/members/update-photo", apiLimiter, async (req, res) => {
    try {
      const { email, membershipId, photoUrl } = req.body;
      if (!email || !membershipId || !photoUrl) {
        return res.status(400).json({ error: "Email, ID Membre et Photo requis" });
      }

      const updated = await storage.updateMemberPhoto(membershipId, email, photoUrl);
      if (!updated) {
        return res.status(404).json({ error: "Membre non trouvé avec ces informations" });
      }

      res.json(updated);
    } catch (error) {
      console.error("Error updating photo:", error);
      res.status(500).json({ error: "Erreur lors de la mise à jour" });
    }
  });

  app.delete("/api/admin/members/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "ID manquant" });
      await (storage as any).deleteMember(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la suppression" });
    }
  });

  app.get("/api/members/verify/:membershipId", async (req, res) => {
    try {
      const member = await storage.getMemberByMembershipId(req.params.membershipId);
      if (!member) {
        return res.status(404).json({ error: "Membre non trouvé" });
      }
      // Return public info only
      res.json({
        firstName: member.firstName,
        nomSpecifiqueUnique: member.nomSpecifiqueUnique,
        membershipId: member.membershipId,
        createdAt: member.createdAt,
        chapter: "Tchad"
      });
    } catch (error) {
      console.error("Error verifying member:", error);
      res.status(500).json({ error: "Erreur lors de la vérification" });
    }
  });

  app.get("/api/members", requireAdmin, async (_req, res) => {
    try {
      const members = await storage.getAllMembers();
      res.json(members);
    } catch (error) {
      console.error("Error fetching members:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des membres" });
    }
  });

  app.get("/api/members/gallery", async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 24;
      const search = req.query.search as string || "";

      const result = await storage.getGalleryMembers({ page, limit, search });
      // Galerie publique : ne jamais exposer email, téléphone ou autres données personnelles.
      res.json({
        ...result,
        members: result.members.map((m) => ({
          id: m.id,
          firstName: m.firstName,
          nomSpecifiqueUnique: m.nomSpecifiqueUnique,
          membershipId: m.membershipId,
          photoUrl: m.photoUrl,
          city: m.city,
          createdAt: m.createdAt,
        })),
      });
    } catch (error) {
      console.error("Error fetching gallery members:", error);
      res.status(500).json({ error: "Erreur lors de la récupération de la galerie" });
    }
  });

  app.get("/api/members/stats", async (_req, res) => {
    try {
      const allMembers = await storage.getAllMembers();
      const withPhoto = allMembers.filter(m => m.photoUrl && m.photoUrl.trim() !== "").length;
      res.json({ total: allMembers.length, withPhoto });
    } catch (error) {
      console.error("Error fetching member stats:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des statistiques" });
    }
  });

  app.post("/api/contact", apiLimiter, async (req, res) => {
    try {
      console.log("Processing contact message from:", req.body.email);
      const validatedData = insertContactMessageSchema.parse(req.body);
      
      const message = await storage.createContactMessage(validatedData).catch(dbError => {
        console.error("DATABASE FAIL in createContactMessage:", dbError);
        throw dbError; // RE-THROW to be caught by outer block
      });

      console.log("Contact message stored in DB, sending emails (async)...");

      // Non-blocking email notifications
      sendNotificationEmail(
        "Nouveau Message de Contact - SAYC Tchad",
        `Nouveau message de ${message.firstName} ${message.nomSpecifiqueUnique} (${message.email}).\nSujet: ${message.subject}\nMessage: ${message.message}`
      );

      sendAutoReplyEmail(
        message.email,
        "Accusé de réception de votre message - SAYC Tchad",
        `Bonjour ${message.firstName},\n\nNous avons bien reçu votre message concernant "${message.subject}".\n\nNotre équipe vous répondra dans les plus brefs délais (généralement sous 48h ouvrables).\n\nCordialement,\nL'équipe SAYC Tchad`
      );

      res.status(201).json(message);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        console.warn("Zod Validation Error in Contact:", error.errors);
        return res.status(400).json({ error: "Données invalides", details: error.errors });
      }
      console.error("FATAL ERROR in /api/contact:", error);
      res.status(500).json({ 
        error: "Erreur lors de l'envoi du message", 
        debug: process.env.NODE_ENV === "production" ? "Check server logs" : error.message 
      });
    }
  });

  app.get("/api/debug-email", requireAdmin, async (req, res) => {
    const result = await debugSmtpConnection();
    res.json(result);
  });

  // ─── Dynamic Image Rendering Endpoints (Decodes base64 for social media crawler support) ───
  app.get("/api/images/opportunities/:id", async (req, res) => {
    try {
      const item = await storage.getOpportunityById(req.params.id);
      if (!item || !item.imageUrl || !item.imageUrl.startsWith("data:image")) {
        return res.redirect("/images/logo.png"); // Fallback to default logo
      }
      const parts = item.imageUrl.split(",");
      const mime = parts[0].match(/:(.*?);/)?.[1] || "image/jpeg";
      const buffer = Buffer.from(parts[1], "base64");
      res.setHeader("Content-Type", mime);
      res.setHeader("Cache-Control", "public, max-age=2592000, s-maxage=2592000"); // Cache navigateur + CDN Vercel 30 jours
      res.send(buffer);
    } catch (error) {
      console.error("Image render error:", error);
      res.redirect("/images/logo.png");
    }
  });

  app.get("/api/images/trainings/:id", async (req, res) => {
    try {
      const item = await storage.getTrainingById(req.params.id);
      if (!item || !item.imageUrl || !item.imageUrl.startsWith("data:image")) {
        return res.redirect("/images/logo.png");
      }
      const parts = item.imageUrl.split(",");
      const mime = parts[0].match(/:(.*?);/)?.[1] || "image/jpeg";
      const buffer = Buffer.from(parts[1], "base64");
      res.setHeader("Content-Type", mime);
      res.setHeader("Cache-Control", "public, max-age=2592000, s-maxage=2592000");
      res.send(buffer);
    } catch (error) {
      console.error("Image render error:", error);
      res.redirect("/images/logo.png");
    }
  });

  app.get("/api/images/events/:id", async (req, res) => {
    try {
      const item = await storage.getEventById(req.params.id);
      if (!item || !item.imageUrl || !item.imageUrl.startsWith("data:image")) {
        return res.redirect("/images/logo.png");
      }
      const parts = item.imageUrl.split(",");
      const mime = parts[0].match(/:(.*?);/)?.[1] || "image/jpeg";
      const buffer = Buffer.from(parts[1], "base64");
      res.setHeader("Content-Type", mime);
      res.setHeader("Cache-Control", "public, max-age=2592000, s-maxage=2592000");
      res.send(buffer);
    } catch (error) {
      console.error("Image render error:", error);
      res.redirect("/images/logo.png");
    }
  });

  app.get("/api/images/news/:id", async (req, res) => {
    try {
      const item = await storage.getNewsArticleById(req.params.id);
      let imgData = "";
      if (item && item.imageUrls && Array.isArray(item.imageUrls) && item.imageUrls[0]) {
        imgData = item.imageUrls[0];
      }
      if (!imgData || !imgData.startsWith("data:image")) {
        return res.redirect("/images/logo.png");
      }
      const parts = imgData.split(",");
      const mime = parts[0].match(/:(.*?);/)?.[1] || "image/jpeg";
      const buffer = Buffer.from(parts[1], "base64");
      res.setHeader("Content-Type", mime);
      res.setHeader("Cache-Control", "public, max-age=2592000, s-maxage=2592000");
      res.send(buffer);
    } catch (error) {
      console.error("Image render error:", error);
      res.redirect("/images/logo.png");
    }
  });

  app.get("/api/contact", requireAdmin, async (_req, res) => {
    try {
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des messages" });
    }
  });

  app.post("/api/newsletter", async (req, res) => {
    try {
      const validatedData = insertNewsletterSubscriberSchema.parse(req.body);
      const existingSubscriber = await storage.getNewsletterSubscriberByEmail(validatedData.email);
      if (existingSubscriber) {
        return res.status(400).json({ error: "Cet email est déjà inscrit à la newsletter" });
      }
      const subscriber = await storage.createNewsletterSubscriber(validatedData);
      res.status(201).json(subscriber);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Email invalide" });
      }
      console.error("Error creating newsletter subscriber:", error);
      res.status(500).json({ error: "Erreur lors de l'inscription à la newsletter" });
    }
  });

  // Opportunities
  app.get("/api/opportunities", async (_req, res) => {
    try {
      const opportunities = await storage.getActiveOpportunities();
      res.json(opportunities);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des opportunités" });
    }
  });

  app.get("/api/opportunities/:id", async (req, res) => {
    try {
      const opportunity = await storage.getOpportunityById(req.params.id);
      if (!opportunity) {
        return res.status(404).json({ error: "Opportunité non trouvée" });
      }
      res.json(opportunity);
    } catch (error) {
      console.error("Error fetching opportunity:", error);
      res.status(500).json({ error: "Erreur lors de la récupération de l'opportunité" });
    }
  });

  app.post("/api/opportunities", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertOpportunitySchema.parse(req.body);
      const opportunity = await storage.createOpportunity(validatedData);
      res.status(201).json(opportunity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Données invalides", details: error.errors });
      }
      console.error("Error creating opportunity:", error);
      res.status(500).json({ error: "Erreur lors de la création de l'opportunité" });
    }
  });

  // Partners
  app.get("/api/partners", async (_req, res) => {
    try {
      const partnersList = await storage.getActivePartners();
      res.json(partnersList);
    } catch (error: any) {
      console.error("Error fetching partners:", error);
      res.status(500).json({
        error: "Erreur lors de la récupération des partenaires",
        details: error.message,
        stack: error.stack
      });
    }
  });

  app.post("/api/partners", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertPartnerSchema.parse(req.body);
      const partner = await storage.createPartner(validatedData);
      res.status(201).json(partner);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Données invalides", details: error.errors });
      }
      console.error("Error creating partner:", error);
      res.status(500).json({ error: "Erreur lors de la création du partenaire" });
    }
  });

  // Trainings
  app.get("/api/trainings", async (_req, res) => {
    try {
      const trainingsList = await storage.getActiveTrainings();
      res.json(trainingsList);
    } catch (error) {
      console.error("Error fetching trainings:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des formations" });
    }
  });

  app.post("/api/trainings", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertTrainingSchema.parse(req.body);
      const training = await storage.createTraining(validatedData);
      res.status(201).json(training);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Données invalides", details: error.errors });
      }
      console.error("Error creating training:", error);
      res.status(500).json({ error: "Erreur lors de la création de la formation" });
    }
  });

  // News
  app.get("/api/news", async (_req, res) => {
    try {
      const articles = await storage.getActiveNewsArticles();
      res.json(articles);
    } catch (error: any) {
      console.error("Error fetching news:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des actualités", details: error.message });
    }
  });

  app.post("/api/news", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertNewsArticleSchema.parse(req.body);
      const article = await storage.createNewsArticle(validatedData);
      res.status(201).json(article);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Données invalides", details: error.errors });
      }
      console.error("Error creating news article:", error);
      res.status(500).json({ error: "Erreur lors de la création de l'article", details: error.message });
    }
  });

  // Events
  app.get("/api/events", async (_req, res) => {
    try {
      const eventsList = await storage.getActiveEvents();
      res.json(eventsList);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des événements" });
    }
  });

  app.post("/api/events", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.status(201).json(event);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Données invalides", details: error.errors });
      }
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Erreur lors de la création de l'événement" });
    }
  });

  // Achievements
  app.get("/api/achievements", async (_req, res) => {
    try {
      const achievementsList = await storage.getActiveAchievements();
      res.json(achievementsList);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des réalisations" });
    }
  });

  app.post("/api/achievements", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertAchievementSchema.parse(req.body);
      const achievement = await storage.createAchievement(validatedData);
      res.status(201).json(achievement);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Données invalides", details: error.errors });
      }
      console.error("Error creating achievement:", error);
      res.status(500).json({ error: "Erreur lors de la création de la réalisation" });
    }
  });

  // Thunderbird Training Applications
  app.post("/api/thunderbird-applications", apiLimiter, async (req, res) => {
    try {
      const validatedData = insertThunderbirdApplicationSchema.parse(req.body);
      const existingApp = await storage.getThunderbirdApplicationByEmail(validatedData.email);

      if (existingApp) {
        return res.status(400).json({ error: "Une candidature avec cet email a déjà été enregistrée." });
      }

      const application = await storage.createThunderbirdApplication(validatedData);

      // Non-blocking email notifications
      sendNotificationEmail(
        "Nouvelle Candidature Thunderbird - SAYC Tchad",
        `Nouvelle candidature Thunderbird de ${application.fullName} (${application.email}).
Sexe: ${application.gender}
Date de naissance: ${application.dateOfBirth}
Ville: ${application.city}
WhatsApp: ${application.phone}
Niveau d'étude: ${application.educationLevel}
Domaine: ${application.fieldOfStudy}
Institution/École: ${application.schoolOrUniversity}
Niveau d'Anglais: ${application.englishLevel}
Parcours souhaité: ${application.targetPathway}

Motivation: ${application.motivation}`
      );

      sendAutoReplyEmail(
        application.email,
        "Confirmation de réception de votre candidature Thunderbird - Smart Africa Youth Chapter Tchad",
        `Bonjour ${application.fullName},\n\nNous avons bien reçu votre candidature pour la cohorte Thunderbird (initiative Najafi 100 Million Learners).\n\nNotre équipe étudiera votre profil avec attention et vous contactera prochainement pour la suite du processus de sélection.\n\nCordialement,\n\nL'équipe SAYC Tchad`
      );

      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Données invalides", details: error.errors });
      }
      console.error("Error creating Thunderbird application:", error);
      res.status(500).json({ error: "Erreur lors de l'enregistrement de votre candidature." });
    }
  });

  app.get("/api/admin/thunderbird-applications", requireAdmin, async (_req, res) => {
    try {
      const applications = await storage.getAllThunderbirdApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching Thunderbird applications:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des candidatures." });
    }
  });

  // AWS re/Start Applications
  app.post("/api/aws-restart-applications", applicationLimiter, async (req, res) => {
    try {
      if (new Date() >= AWS_RESTART_APPLICATION_DEADLINE) {
        return res.status(403).json({
          error: "Les candidatures sont clôturées depuis le 13 novembre 2026 à minuit. Les résultats seront annoncés le 20 novembre 2026.",
        });
      }
      await ensureAwsVideoColumn();
      const validatedData = insertAwsRestartApplicationSchema.parse(req.body);
      const existingApp = await storage.getAwsRestartApplicationByEmail(validatedData.email);

      if (existingApp) {
        return res.status(400).json({ error: "Une candidature avec cet email a déjà été enregistrée pour ce programme." });
      }

      const application = await storage.createAwsRestartApplication(validatedData);

      sendNotificationEmail(
        "Nouvelle Candidature AWS re/Start - SAYC Tchad",
        `Nouvelle candidature AWS re/Start de ${application.fullName} (${application.email}).
Téléphone: ${application.phone}
Ville: ${application.city}
Date de naissance: ${application.dateOfBirth}
Sexe: ${application.gender}
Statut professionnel: ${application.professionalStatus}
Handicap: ${application.hasDisability}
Engagement temps plein: ${application.fullTimeCommitment ? 'Oui' : 'Non'}
Vidéo de présentation: ${application.videoUrl || 'Non fournie'}
Photo d'identité: ${application.photoUrl ? 'Fournie (visible dans l\'espace admin)' : 'Non fournie'}

Motivation: ${application.motivation}`
      );

      sendAutoReplyEmail(
        application.email,
        "Confirmation de réception de votre candidature AWS re/Start",
        `Bonjour ${application.fullName},\n\nNous avons bien reçu votre candidature pour le programme AWS re/Start organisé en partenariat avec Smart Africa Youth Chapter Tchad.\n\nNotre équipe examinera votre profil et vous tiendra informé(e) de la suite du processus.\n\nCordialement,\n\nL'équipe SAYC Tchad`
      );

      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Données invalides", details: error.errors });
      }
      console.error("Error creating AWS re/Start application:", error);
      res.status(500).json({ error: "Erreur lors de l'enregistrement de votre candidature." });
    }
  });

  // ─── Invest Ready Tchad : candidatures start-ups ─────────────────────────────
  app.post("/api/invest-ready-applications", applicationLimiter, async (req, res) => {
    try {
      if (new Date() >= INVEST_READY_DEADLINE) {
        return res.status(403).json({ error: "Les candidatures sont closes" });
      }
      await ensureInvestReadyTable();
      const validatedData = insertInvestReadyApplicationSchema.parse(req.body);

      const existing = await storage.getInvestReadyApplicationByEmail(validatedData.founderEmail);
      if (existing) {
        return res.status(409).json({ error: "Une candidature a déjà été soumise avec cet email." });
      }

      const application = await storage.createInvestReadyApplication(validatedData);

      // En serverless, la fonction peut se figer dès la réponse envoyée :
      // on attend la fin des envois d'emails avant de répondre.
      await sendNotificationEmail(
        "Nouvelle Candidature Invest Ready Tchad",
        `Nouvelle candidature Invest Ready Tchad.

Start-up: ${application.startupName}
Secteur: ${application.sector} | Stade: ${application.stage} | Créée en: ${application.foundingYear}
Levée envisagée: ${application.fundingAmount} (échéance: ${application.fundingTimeline})
Site/réseaux: ${application.website || "Non fourni"}

Fondateur principal: ${application.founderFirstName} ${application.founderLastName} (${application.founderGender})
Email: ${application.founderEmail} | WhatsApp: ${application.founderPhone}
Deuxième participant: ${application.secondFirstName ? `${application.secondFirstName} ${application.secondLastName} (${application.secondGender})` : "Aucun"}

Pièce d'identité: ${application.idFileName}
Pitch deck: ${application.deckFileName || "Non fourni"}

Description:
${application.description}`
      );

      await sendAutoReplyEmail(
        application.founderEmail,
        "Confirmation de réception : candidature Invest Ready Tchad",
        `Bonjour ${application.founderFirstName},\n\nNous confirmons la bonne réception de la candidature de ${application.startupName} au bootcamp Invest Ready Tchad, organisé par le Smart Africa Youth Chapter Tchad avec le soutien de l'Ambassade de France au Tchad.\n\nLes 20 start-ups sélectionnées seront notifiées par email et WhatsApp.\n\nCordialement,\nL'équipe SAYC Tchad`
      );

      res.status(201).json({ success: true, id: application.id });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors?.[0]?.message || "Données invalides", details: error.errors });
      }
      console.error("Error creating Invest Ready application:", error);
      res.status(500).json({ error: "Erreur lors de l'envoi de la candidature" });
    }
  });

  app.get("/api/admin/invest-ready-applications", requireAdmin, async (_req, res) => {
    try {
      await ensureInvestReadyTable();
      const apps = await storage.getAllInvestReadyApplications();
      // Les fichiers (base64, lourds) sont servis individuellement via l'endpoint /file.
      res.json(apps.map(({ idFileData, deckFileData, ...rest }) => ({
        ...rest,
        hasId: !!idFileData,
        hasDeck: !!deckFileData,
      })));
    } catch (error) {
      console.error("Error fetching Invest Ready applications:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.get("/api/admin/invest-ready-applications/:id/file", requireAdmin, async (req, res) => {
    try {
      await ensureInvestReadyTable();
      const type = req.query.type === "deck" ? "deck" : "id";
      // Une seule ligne, une seule colonne : pas de transfert inutile depuis Neon.
      const rows = (type === "deck"
        ? await sql`SELECT deck_file_data AS data, deck_file_name AS name FROM invest_ready_applications WHERE id = ${req.params.id} LIMIT 1`
        : await sql`SELECT id_file_data AS data, id_file_name AS name FROM invest_ready_applications WHERE id = ${req.params.id} LIMIT 1`) as any[];
      if (rows.length === 0) return res.status(404).json({ error: "Candidature introuvable" });
      const data: string | null = rows[0].data;
      const name: string = rows[0].name || `${type}.bin`;
      if (!data || !data.startsWith("data:")) return res.status(404).json({ error: "Fichier introuvable" });
      const parts = data.split(",");
      const mime = parts[0].match(/:(.*?);/)?.[1] || "application/octet-stream";
      const buffer = Buffer.from(parts[1], "base64");
      res.setHeader("Content-Type", mime);
      res.setHeader("Content-Disposition", `attachment; filename="${name.replace(/[^\w.\- ]/g, "_")}"`);
      res.send(buffer);
    } catch (error) {
      console.error("Error serving Invest Ready file:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.get("/api/admin/aws-restart-applications", requireAdmin, async (_req, res) => {
    try {
      await ensureAwsVideoColumn();
      const applications = await storage.getAllAwsRestartApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching AWS re/Start applications:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des candidatures AWS re/Start." });
    }
  });

  app.get("/robots.txt", (req, res) => {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml`;
    res.header("Content-Type", "text/plain");
    res.send(robotsTxt);
  });

  // Admin Authentication with brute-force protection
  const loginAttempts = new Map<string, { count: number; lastAttempt: number; lockedUntil: number }>();
  const MAX_ATTEMPTS = 5;
  const LOCK_DURATION = 15 * 60 * 1000; // 15 minutes
  const ATTEMPT_WINDOW = 10 * 60 * 1000; // 10 minutes

  app.post("/api/admin/login", (req, res) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    let record = loginAttempts.get(ip);

    if (record && record.lockedUntil > now) {
      const remainingMinutes = Math.ceil((record.lockedUntil - now) / 60000);
      return res.status(429).json({
        error: `Trop de tentatives. Réessayez dans ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}.`,
        lockedUntil: record.lockedUntil,
        remainingMinutes,
      });
    }

    if (record && (now - record.lastAttempt) > ATTEMPT_WINDOW) {
      loginAttempts.delete(ip);
      record = undefined;
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      // Jamais de mot de passe par défaut dans le code : le dépôt est public.
      return res.status(503).json({ error: "Administration non configurée. Définissez ADMIN_PASSWORD dans les variables d'environnement." });
    }

    const { password } = req.body;
    if (password === adminPassword) {
      loginAttempts.delete(ip);
      req.session.isAdmin = true;
      res.json({ success: true });
    } else {
      if (!record) {
        record = { count: 0, lastAttempt: now, lockedUntil: 0 };
      }
      record.count += 1;
      record.lastAttempt = now;

      if (record.count >= MAX_ATTEMPTS) {
        record.lockedUntil = now + LOCK_DURATION;
        loginAttempts.set(ip, record);
        return res.status(429).json({
          error: "Trop de tentatives. Compte verrouillé pour 15 minutes.",
          lockedUntil: record.lockedUntil,
          remainingMinutes: 15,
        });
      }

      loginAttempts.set(ip, record);
      const remaining = MAX_ATTEMPTS - record.count;
      res.status(401).json({
        error: `Mot de passe incorrect. ${remaining} tentative${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}.`,
        remainingAttempts: remaining,
      });
    }
  });

  // ─── Suivi AWS re/Start pour l'Ambassade (lecture seule, code d'accès dédié) ─
  app.get("/api/aws-tracking", async (req, res) => {
    try {
      const accessCode = process.env.EMBASSY_ACCESS_CODE;
      if (!accessCode) {
        return res.status(503).json({ error: "Suivi non configuré : définissez EMBASSY_ACCESS_CODE dans les variables d'environnement." });
      }
      const provided = (req.query.code as string) || "";
      const isAdmin = !!req.session.isAdmin;
      if (!isAdmin && provided !== accessCode) {
        return res.status(401).json({ error: "Code d'accès invalide" });
      }
      await ensureAwsVideoColumn();
      const applications = await storage.getAllAwsRestartApplications();
      // Lecture seule. Les photos (lourdes) sont servies individuellement via /api/aws-tracking/:id.
      const rows = applications.map((a) => ({
        id: a.id,
        fullName: a.fullName,
        gender: a.gender,
        city: a.city,
        dateOfBirth: a.dateOfBirth,
        email: a.email,
        phone: a.phone,
        professionalStatus: a.professionalStatus,
        status: a.status,
        videoUrl: a.videoUrl,
        hasPhoto: !!a.photoUrl,
        motivation: a.motivation,
        createdAt: a.createdAt,
      }));
      const stats = {
        total: rows.length,
        femmes: rows.filter((r) => r.gender === "F").length,
        hommes: rows.filter((r) => r.gender === "M").length,
        avecVideo: rows.filter((r) => !!r.videoUrl).length,
      };
      res.json({ stats, applications: rows });
    } catch (error) {
      console.error("Error in aws-tracking:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // Décision des partenaires sur un dossier (favorable / défavorable / en attente)
  app.patch("/api/aws-tracking/:id/status", async (req, res) => {
    try {
      const accessCode = process.env.EMBASSY_ACCESS_CODE;
      const provided = (req.query.code as string) || (req.body?.code as string) || "";
      if (!req.session.isAdmin && (!accessCode || provided !== accessCode)) {
        return res.status(401).json({ error: "Code d'accès invalide" });
      }
      const { status } = req.body || {};
      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Statut invalide" });
      }
      await ensureAwsVideoColumn();
      const updated = await storage.updateAwsRestartApplicationStatus(req.params.id, status);
      if (!updated) return res.status(404).json({ error: "Candidature introuvable" });
      res.json({ success: true, id: updated.id, status: updated.status });
    } catch (error) {
      console.error("Error updating tracking status:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // Photo d'un candidat (servie à la demande pour garder la liste légère)
  app.get("/api/aws-tracking/:id/photo", async (req, res) => {
    try {
      const accessCode = process.env.EMBASSY_ACCESS_CODE;
      const provided = (req.query.code as string) || "";
      if (!req.session.isAdmin && (!accessCode || provided !== accessCode)) {
        return res.status(401).json({ error: "Code d'accès invalide" });
      }
      await ensureAwsVideoColumn();
      // Une seule ligne lue : surtout pas toute la table (économie de transfert réseau).
      const rows = (await sql`SELECT photo_url FROM aws_restart_applications WHERE id = ${req.params.id} LIMIT 1`) as any[];
      const photoUrl: string | undefined = rows[0]?.photo_url;
      if (!photoUrl || !photoUrl.startsWith("data:image")) {
        return res.status(404).json({ error: "Photo introuvable" });
      }
      const parts = photoUrl.split(",");
      const mime = parts[0].match(/:(.*?);/)?.[1] || "image/jpeg";
      const buffer = Buffer.from(parts[1], "base64");
      res.setHeader("Content-Type", mime);
      res.setHeader("Cache-Control", "private, max-age=3600");
      res.send(buffer);
    } catch (error) {
      console.error("Error serving tracking photo:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ─── Outil temporaire : vider les anciennes candidatures AWS re/Start ────────
  // Protégé par le mot de passe admin. À SUPPRIMER après usage.
  // ─── Migration d'urgence : quota réseau Neon épuisé ──────────────────────────
  // Copie les données de la base actuelle (ou d'une source donnée) vers une autre
  // base Neon désignée par le nom d'une variable d'environnement (ex: NEWDB_URL).
  // Protégé par le mot de passe admin. Outil temporaire, à SUPPRIMER après usage.
  app.get("/api/admin/emergency-migrate", async (req, res) => {
    try {
      const adminPassword = process.env.ADMIN_PASSWORD;
      const authorized = req.session.isAdmin || (adminPassword && req.query.key === adminPassword);
      if (!authorized) {
        return res.status(401).json({ error: "Non autorisé. Ajoutez &key=VOTRE_MOT_DE_PASSE_ADMIN à l'adresse." });
      }
      const targetEnv = (req.query.target_env as string) || "NEWDB_URL";
      if (!/^[A-Z0-9_]{3,64}$/.test(targetEnv)) {
        return res.status(400).json({ error: "Nom de variable cible invalide" });
      }
      const targetUrl = process.env[targetEnv];
      if (!targetUrl || !targetUrl.startsWith("postgres")) {
        return res.status(400).json({ error: `La variable d'environnement ${targetEnv} est absente ou invalide. Connectez la base de secours au projet Vercel avec le préfixe correspondant, puis redéployez.` });
      }
      const sourceUrl = (req.query.source_url as string) || process.env.DATABASE_URL;
      if (!sourceUrl || !sourceUrl.startsWith("postgres")) {
        return res.status(400).json({ error: "Source invalide" });
      }
      const hostOf = (u: string) => { try { return new URL(u).host; } catch { return u; } };
      if (hostOf(sourceUrl) === hostOf(targetUrl)) {
        return res.status(400).json({ error: "La source et la cible sont la même base." });
      }
      if (req.query.confirm !== "oui") {
        return res.json({
          source: hostOf(sourceUrl),
          cible: `${targetEnv} → ${hostOf(targetUrl)}`,
          message: "Prêt à migrer. Ajoutez &confirm=oui à l'adresse pour lancer la copie.",
        });
      }

      const src = neon(sourceUrl);
      const dst = neon(targetUrl);

      const tables = (await src.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY table_name",
        []
      )) as any[];

      const report: any[] = [];
      for (const { table_name: table } of tables) {
        const cols = (await src.query(
          `SELECT column_name, data_type, udt_name, is_nullable, column_default
           FROM information_schema.columns
           WHERE table_schema='public' AND table_name=$1
           ORDER BY ordinal_position`,
          [table]
        )) as any[];

        const colDefs = cols.map((c: any) => {
          let type: string;
          if (c.data_type === "ARRAY") type = `${String(c.udt_name).replace(/^_/, "")}[]`;
          else if (c.data_type === "USER-DEFINED") type = c.udt_name;
          else type = c.data_type;
          let def = `"${c.column_name}" ${type}`;
          if (c.column_default) def += ` DEFAULT ${c.column_default}`;
          if (c.is_nullable === "NO") def += " NOT NULL";
          return def;
        });
        await dst.query(`CREATE TABLE IF NOT EXISTS "${table}" (${colDefs.join(", ")})`, []);

        const constraints = (await src.query(
          `SELECT con.conname, pg_get_constraintdef(con.oid) AS def
           FROM pg_constraint con
           JOIN pg_class rel ON rel.oid = con.conrelid
           JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
           WHERE nsp.nspname='public' AND rel.relname=$1 AND con.contype IN ('p','u')`,
          [table]
        )) as any[];
        for (const c of constraints) {
          try {
            await dst.query(`ALTER TABLE "${table}" ADD CONSTRAINT "${c.conname}" ${c.def}`, []);
          } catch {
            // contrainte déjà présente : sans gravité
          }
        }

        const srcCount = Number(((await src.query(`SELECT count(*)::int AS count FROM "${table}"`, [])) as any[])[0].count);
        const dstCount = Number(((await dst.query(`SELECT count(*)::int AS count FROM "${table}"`, [])) as any[])[0].count);
        if (dstCount > 0) {
          report.push({ table, lignes_source: srcCount, copiees: 0, note: "la table contient déjà des données, ignorée" });
          continue;
        }
        if (srcCount === 0) {
          report.push({ table, lignes_source: 0, copiees: 0 });
          continue;
        }

        const colNames = cols.map((c: any) => `"${c.column_name}"`).join(", ");
        const batchSize = Math.max(1, Math.floor(500 / cols.length));
        let copied = 0;
        for (let offset = 0; offset < srcCount; offset += batchSize) {
          const rows = (await src.query(`SELECT * FROM "${table}" ORDER BY 1 LIMIT $1 OFFSET $2`, [batchSize, offset])) as any[];
          if (rows.length === 0) break;
          const params: any[] = [];
          const valuesSql = rows
            .map(
              (row: any, ri: number) =>
                `(${cols.map((c: any, ci: number) => {
                  params.push(row[c.column_name]);
                  return `$${ri * cols.length + ci + 1}`;
                }).join(", ")})`
            )
            .join(", ");
          await dst.query(`INSERT INTO "${table}" (${colNames}) VALUES ${valuesSql}`, params);
          copied += rows.length;
        }
        report.push({ table, lignes_source: srcCount, copiees: copied });
      }

      res.json({ success: true, message: "Migration d'urgence terminée ! Basculez DATABASE_URL vers la nouvelle base puis redéployez.", tables: report });
    } catch (error: any) {
      console.error("Emergency migration error:", error);
      res.status(500).json({ error: "Erreur de migration", details: error.message });
    }
  });

  app.get("/api/admin/clear-aws-applications", async (req, res) => {
    try {
      const adminPassword = process.env.ADMIN_PASSWORD;
      const authorized = req.session.isAdmin || (adminPassword && req.query.key === adminPassword);
      if (!authorized) {
        return res.status(401).json({ error: "Non autorisé. Ajoutez &key=VOTRE_MOT_DE_PASSE_ADMIN à l'adresse." });
      }
      const [{ count: before }] = (await sql`SELECT count(*)::int AS count FROM aws_restart_applications`) as any[];
      if (req.query.confirm !== "oui") {
        return res.json({
          candidatures_actuelles: Number(before),
          message: `Prêt à supprimer ${before} candidature(s) AWS re/Start. Ajoutez &confirm=oui à l'adresse pour confirmer la suppression DÉFINITIVE.`,
        });
      }
      await sql`DELETE FROM aws_restart_applications`;
      res.json({
        success: true,
        supprimees: Number(before),
        message: "Anciennes candidatures AWS re/Start supprimées. Le compteur repart à zéro pour le nouvel appel.",
      });
    } catch (error: any) {
      console.error("Clear AWS applications error:", error);
      res.status(500).json({ error: "Erreur lors de la suppression" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  app.get("/api/admin/check", (req, res) => {
    res.json({ isAdmin: !!req.session.isAdmin });
  });

  // Admin CRUD routes
  app.get("/api/admin/opportunities", requireAdmin, async (_req, res) => {
    try { res.json(await storage.getAllOpportunities()); }
    catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
  });
  app.put("/api/admin/opportunities/:id", requireAdmin, async (req, res) => {
    try { const updated = await storage.updateOpportunity(req.params.id as string, req.body); res.json(updated); }
    catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
  });
  app.delete("/api/admin/opportunities/:id", requireAdmin, async (req, res) => {
    try { 
      const { id } = req.params;
      if (!id) return res.status(400).json({ error: "ID manquant" });
      await (storage as any).deleteOpportunity(id); 
      res.json({ success: true }); 
    }
    catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
  });

  app.get("/api/admin/partners", requireAdmin, async (_req, res) => {
    try { res.json(await storage.getAllPartners()); }
    catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
  });
  app.put("/api/admin/partners/:id", requireAdmin, async (req, res) => {
    try { const updated = await storage.updatePartner(req.params.id as string, req.body); res.json(updated); }
    catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
  });
  app.delete("/api/admin/partners/:id", requireAdmin, async (req, res) => {
    try { await storage.deletePartner(req.params.id as string); res.json({ success: true }); }
    catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
  });

  app.get("/api/admin/trainings", requireAdmin, async (_req, res) => {
    try { res.json(await storage.getAllTrainings()); }
    catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
  });
  app.put("/api/admin/trainings/:id", requireAdmin, async (req, res) => {
    try { const updated = await storage.updateTraining(req.params.id as string, req.body); res.json(updated); }
    catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
  });
  app.delete("/api/admin/trainings/:id", requireAdmin, async (req, res) => {
    try { await storage.deleteTraining(req.params.id as string); res.json({ success: true }); }
    catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
  });

  app.get("/api/admin/news", requireAdmin, async (_req, res) => {
    try { res.json(await storage.getAllNewsArticles()); }
    catch (error: any) { 
      console.error("Error fetching admin news:", error);
      res.status(500).json({ error: "Erreur serveur", details: error.message }); 
    }
  });
  app.put("/api/admin/news/:id", requireAdmin, async (req, res) => {
    try { const updated = await storage.updateNewsArticle(req.params.id as string, req.body); res.json(updated); }
    catch (error: any) { 
      console.error("Error updating admin news:", error);
      res.status(500).json({ error: "Erreur serveur", details: error.message }); 
    }
  });
  app.delete("/api/admin/news/:id", requireAdmin, async (req, res) => {
    try { await storage.deleteNewsArticle(req.params.id as string); res.json({ success: true }); }
    catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
  });

  app.get("/api/admin/events", requireAdmin, async (_req, res) => {
    try { res.json(await storage.getAllEvents()); }
    catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
  });
  app.put("/api/admin/events/:id", requireAdmin, async (req, res) => {
    try { const updated = await storage.updateEvent(req.params.id as string, req.body); res.json(updated); }
    catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
  });
  app.delete("/api/admin/events/:id", requireAdmin, async (req, res) => {
    try { await storage.deleteEvent(req.params.id as string); res.json({ success: true }); }
    catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
  });

  // Elections API
  app.get("/api/elections/candidates", async (_req, res) => {
    try {
      const candidates = await storage.getApprovedCandidates();
      res.json(candidates);
    } catch (error) {
      res.status(500).json({ error: "Erreur lors de la récupération des candidats" });
    }
  });

  app.get("/api/elections/audit-votes", async (_req, res) => {
    try {
      const votes = await storage.getAllVotesWithDetails();
      // Masquer les emails des votants : seul le début reste visible publiquement.
      const masked = votes.map((v: any) => ({
        ...v,
        voterId: typeof v.voterId === "string" && v.voterId.includes("@")
          ? `${v.voterId.slice(0, 3)}***@***${v.voterId.slice(v.voterId.lastIndexOf("."))}`
          : v.voterId,
      }));
      res.json(masked);
    } catch (error: any) {
      console.error("Error fetching audit votes:", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.post("/api/elections/apply", async (req, res) => {
    try {
      const validatedData = insertCandidateSchema.parse(req.body);
      const candidate = await storage.createCandidate(validatedData);

      sendNotificationEmail(
        "Nouvelle Candidature Election - SAYC Tchad",
        `Nouvelle candidature de ${candidate.firstName} ${candidate.nomSpecifiqueUnique} pour le poste de ${candidate.role}.\nEmail: ${candidate.email}`
      );

      res.status(201).json(candidate);
    } catch (error: any) {
      console.error("Error in /api/elections/apply:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Données invalides", details: error.errors });
      }
      res.status(500).json({ error: "Erreur lors du dépôt de candidature" });
    }
  });

  app.post("/api/elections/check-votes", async (req, res) => {
    try {
      const { membershipId, email } = req.body;
      if (!membershipId || !email) {
        return res.status(400).json({ error: "Informations manquantes" });
      }

      const trimmedId = membershipId.trim().toUpperCase();
      const trimmedEmail = email.trim().toLowerCase();

      const member = await storage.getMemberByMembershipId(trimmedId);
      if (!member || member.email.toLowerCase() !== trimmedEmail) {
        return res.status(401).json({ error: "ID de membre ou email invalide." });
      }

      const voterKey = `${trimmedId}-${trimmedEmail}`;
      const votedRoles = await storage.getVotedRoles(voterKey);
      res.json({ votedRoles });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.post("/api/elections/vote", async (req, res) => {
    try {
      const { membershipId, email, candidateId, role } = req.body;

      if (!membershipId || !email || !candidateId || !role) {
        return res.status(400).json({ error: "Informations manquantes" });
      }

      // 1. Verify membership
      const trimmedId = membershipId.trim().toUpperCase();
      const trimmedEmail = email.trim().toLowerCase();

      const member = await storage.getMemberByMembershipId(trimmedId);
      if (!member || member.email.toLowerCase() !== trimmedEmail) {
        return res.status(401).json({ error: "ID de membre ou email invalide. Seuls les membres inscrits peuvent voter." });
      }

      // 2. Check if already voted for this role
      const voterKey = `${trimmedId}-${trimmedEmail}`;
      const alreadyVoted = await storage.hasVoted(voterKey, role);
      if (alreadyVoted) {
        return res.status(400).json({ error: "Vous avez déjà voté pour ce poste." });
      }

      // 3. Cast vote
      const vote = await storage.castVote({
        voterId: voterKey,
        candidateId,
        role
      });

      res.status(201).json({ success: true, message: "Votre vote a été enregistré." });
    } catch (error) {
      console.error("Error voting:", error);
      res.status(500).json({ error: "Erreur lors du vote." });
    }
  });

  // Admin Election Management
  // TEMPORARY DIAGNOSTIC ENDPOINT - remove after debugging
  app.get("/api/admin/elections/diagnose", requireAdmin, async (_req, res) => {
    const result: any = { status: "running", steps: [] };
    try {
      result.steps.push("1. Testing DB connection...");
      const { db } = await import("./db");
      result.steps.push("2. DB module loaded. Testing raw query...");
      const { sql } = await import("drizzle-orm");
      const testResult = await db.execute(sql`SELECT 1 as test`);
      result.steps.push(`3. DB connected. Testing election_candidates table...`);
      const tableCheck = await db.execute(sql`SELECT COUNT(*) as count FROM election_candidates`);
      result.steps.push(`4. Table exists. Row count: ${JSON.stringify(tableCheck.rows[0])}`);
      const candidates = await db.execute(sql`SELECT id, first_name, last_name, status FROM election_candidates LIMIT 5`);
      result.candidates = candidates.rows;
      result.status = "ok";
      res.json(result);
    } catch (error: any) {
      result.status = "error";
      result.error = error.message;
      result.code = error.code;
      result.steps.push(`ERROR: ${error.message}`);
      res.status(500).json(result);
    }
  });

  app.get("/api/admin/elections/candidates", requireAdmin, async (_req, res) => {
    try {
      const candidates = await storage.getAllCandidates();
      res.json(candidates);
    } catch (error: any) {
      console.error("Error fetching candidates:", error);
      res.status(500).json({ error: "Erreur serveur", details: error.message });
    }
  });

  app.get("/api/admin/elections/votes", requireAdmin, async (_req, res) => {
    try {
      const votes = await storage.getAllVotesWithDetails();
      res.json(votes);
    } catch (error: any) {
      console.error("Error fetching votes:", error);
      res.status(500).json({ error: "Erreur serveur", details: error.message });
    }
  });

  app.patch("/api/admin/elections/candidates/:id/status", requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      if (!["approved", "rejected", "pending"].includes(status)) {
        return res.status(400).json({ error: "Statut invalide" });
      }
      const updated = await storage.updateCandidateStatus(req.params.id as string, status);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.get("/api/admin/achievements", requireAdmin, async (_req, res) => {
    try { res.json(await storage.getAllAchievements()); }
    catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
  });
  app.put("/api/admin/achievements/:id", requireAdmin, async (req, res) => {
    try { const updated = await storage.updateAchievement(req.params.id as string, req.body); res.json(updated); }
    catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
  });
  app.delete("/api/admin/achievements/:id", requireAdmin, async (req, res) => {
    try { await storage.deleteAchievement(req.params.id as string); res.json({ success: true }); }
    catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
  });

  app.get("/api/admin/members", requireAdmin, async (_req, res) => {
    try { res.json(await storage.getAllMembers()); }
    catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
  });

  app.get("/api/admin/contact", requireAdmin, async (_req, res) => {
    try { res.json(await storage.getAllContactMessages()); }
    catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
  });

  app.get("/api/admin/newsletter", requireAdmin, async (_req, res) => {
    try { res.json(await storage.getAllNewsletterSubscribers()); }
    catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
  });

  app.post("/api/admin/contact/:id/reply", requireAdmin, async (req, res) => {
    try {
      const { message: replyText } = req.body;
      if (!replyText) {
        return res.status(400).json({ error: "Le message de réponse est requis" });
      }

      const originalMessage = await storage.getContactMessageById(req.params.id as string);
      if (!originalMessage) {
        return res.status(404).json({ error: "Message original introuvable" });
      }

      await sendAutoReplyEmail(
        originalMessage.email,
        `Réponse à votre message : ${originalMessage.subject}`,
        replyText,
        true // Include SADA banner
      );

      res.json({ success: true });
    } catch (error: any) {
      console.error("Error replying to contact message:", error);
      res.status(500).json({ error: "Erreur lors de l'envoi de la réponse", details: error.message });
    }
  });

  app.post("/api/admin/members/send-voting-info", requireAdmin, async (req, res) => {
    try {
      const { memberIds } = req.body;
      let members;
      if (memberIds && Array.isArray(memberIds)) {
        members = await Promise.all(memberIds.map(id => storage.getMember(id)));
        members = members.filter(Boolean);
      } else {
        members = await storage.getAllMembers();
      }
      
      const subject = "Information Importante : Processus de Vote - SAYC Tchad";
      
      const messageTemplate = `Bonjour {{firstName}},

      Votre participation au processus de vote du SAYC Tchad est essentielle. Voici vos informations personnelles nécessaires pour voter :
      - ID Membre : {{membershipId}}
      - Email : {{email}}

      PRINCIPE DE VOTE :
      En tant que membre, vous avez le droit de voter pour un candidat par poste électif. Le vote se fera exclusivement via notre plateforme sécurisée. Assurez-vous d'avoir votre ID Membre à portée de main.

      Rejoignez notre communauté pour suivre les actualités :
      - WhatsApp : https://chat.whatsapp.com/CB0pBpYzYyBIw2zZB3A8Kj
      - Facebook : https://www.facebook.com/profile.php?id=61585729201040

      Cordialement,
      L'équipe SAYC Tchad`;

      const result = await sendPersonalizedMemberEmails(members, subject, messageTemplate);
      res.json(result);
    } catch (error: any) {
      console.error("Error in send-voting-info route:", error);
      res.status(500).json({ error: "Erreur lors de l'envoi des emails personnalisés", details: error.message });
    }
  });

  app.post("/api/admin/members/generate-ids", requireAdmin, async (_req, res) => {
    try {
      const count = await storage.generateMissingMembershipIds();
      res.json({ success: true, count });
    } catch (error: any) {
      console.error("Error generating membership IDs:", error);
      res.status(500).json({ error: "Erreur lors de la génération des IDs", details: error.message });
    }
  });

  app.post("/api/admin/mass-email", requireAdmin, async (req, res) => {
    try {
      const { target, subject, message, includeSada, memberIds } = req.body;
      if (!subject || !message) {
        return res.status(400).json({ error: "Sujet et message requis" });
      }

      let recipients: string[] = [];

      if (memberIds && Array.isArray(memberIds)) {
        // Direct list of emails or IDs
        recipients = memberIds;
      } else if (target === "members") {
        const members = await storage.getAllMembers();
        recipients = members.map(m => m.email);
      } else if (target === "thunderbird") {
        const apps = await storage.getThunderbirdApplications();
        recipients = apps.map(a => a.email);
      } else if (target === "thunderbird_cohort2") {
        const apps = await storage.getApprovedThunderbirdApplications();
        const approvedCohort2 = apps.filter(a => a.cohort && a.cohort.includes("Cohorte 2"));
        recipients = approvedCohort2.map(a => a.email);
      } else if (target === "thunderbird_cohort1") {
        const apps = await storage.getApprovedThunderbirdApplications();
        const approvedCohort1 = apps.filter(a => !a.cohort || a.cohort === "Tchad 2024" || !a.cohort.includes("Cohorte 2"));
        recipients = approvedCohort1.map(a => a.email);
      } else if (target === "thunderbird_approved") {
        const apps = await storage.getApprovedThunderbirdApplications();
        recipients = apps.map(a => a.email);
      } else if (target === "elections_candidates") {
        const candidates = await storage.getAllCandidates();
        recipients = candidates.map(c => c.email);
      } else if (target === "newsletter") {
        const subs = await storage.getAllNewsletterSubscribers();
        recipients = subs.map(s => s.email);
      }

      // Remove duplicates and empty emails
      recipients = Array.from(new Set(recipients)).filter(e => e && e.includes("@"));

      if (recipients.length === 0) {
        return res.status(400).json({ error: "Aucun destinataire trouvé pour ce groupe" });
      }

      // If memberIds was not provided, we just return the list of recipients to the frontend for chunking
      if (!memberIds || !Array.isArray(memberIds)) {
        return res.json({ success: true, recipients });
      }

      const result = await sendMassEmail(recipients, subject, message, includeSada);
      res.json(result);
    } catch (error: any) {
      console.error("Error in mass-email route:", error);
      res.status(500).json({ 
        error: "Erreur lors de l'envoi", 
        message: error.message,
        code: error.code 
      });
    }
  });

  app.get("/api/admin/debug-smtp", requireAdmin, async (_req, res) => {
    try {
      const result = await debugSmtpConnection();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Thunderbird API
  app.get("/api/thunderbird/results", async (req, res) => {
    try {
      const results = await storage.getApprovedThunderbirdApplications();
      if (results.length === 0) {
        // Fallback hardcoded if DB is empty for debug
        return res.json([
          { id: "1", fullName: "ADRIEN NDJETI", gender: "Masculin", city: "N'Djamena", status: "approved" },
          { id: "2", fullName: "Sefadine Taha", gender: "Masculin", city: "Abéché", status: "approved" }
        ]);
      }
      res.json(results);
    } catch (e) {
      console.error("Error fetching Thunderbird results:", e);
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.get("/api/thunderbird/applications", requireAdmin, async (_req, res) => {
    try {
      res.json(await storage.getThunderbirdApplications());
    } catch (e) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.patch("/api/thunderbird/applications/:id/status", requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      const updated = await storage.updateThunderbirdApplicationStatus(req.params.id as string, status);
      if (!updated) return res.status(404).send("Non trouvé");
      res.json(updated);
    } catch (e) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ─── Plan Activities (Calendrier Semestriel) ─────────────────────────────────────────
  // Public: liste les activités actives pour la page PlanActivites
  app.get("/api/plan-activities", async (_req, res) => {
    try {
      const activities = await storage.getActivePlanActivities();
      res.json(activities);
    } catch (error) {
      console.error("Error fetching plan activities:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des activités" });
    }
  });

  // Admin: liste toutes les activités (actives + inactives)
  app.get("/api/admin/plan-activities", requireAdmin, async (_req, res) => {
    try {
      const activities = await storage.getAllPlanActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // Admin: créer une activité
  app.post("/api/plan-activities", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertPlanActivitySchema.parse(req.body);
      const activity = await storage.createPlanActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Données invalides", details: error.errors });
      }
      res.status(500).json({ error: "Erreur lors de la création" });
    }
  });

  // Admin: mettre à jour une activité
  app.put("/api/admin/plan-activities/:id", requireAdmin, async (req, res) => {
    try {
      const updated = await storage.updatePlanActivity(req.params.id as string, req.body);
      if (!updated) return res.status(404).json({ error: "Activité non trouvée" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // Admin: supprimer une activité
  app.delete("/api/admin/plan-activities/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deletePlanActivity(req.params.id as string);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // ─── Activity Reports (Rapports soumis via le formulaire public) ───────────────
  // Public: soumettre un rapport (rate limité)
  app.post("/api/activity-reports", apiLimiter, async (req, res) => {
    try {
      const validatedData = insertActivityReportSchema.parse(req.body);
      const report = await storage.createActivityReport(validatedData);

      // Notification email non-bloquante
      sendNotificationEmail(
        "Nouveau Rapport Soumis - SAYC Tchad",
        `Un nouveau rapport a été soumis.\nTitre : ${report.title}\nType : ${report.type}\nDescription : ${report.description}\nFichier : ${report.fileName || 'Aucun'}`
      );

      res.status(201).json({ success: true, id: report.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Données invalides", details: error.errors });
      }
      console.error("Error creating activity report:", error);
      res.status(500).json({ error: "Erreur lors de la soumission du rapport" });
    }
  });

  // Admin: liste tous les rapports
  app.get("/api/admin/activity-reports", requireAdmin, async (_req, res) => {
    try {
      const reports = await storage.getAllActivityReports();
      // Ne pas renvoyer les données binaires du fichier dans la liste (trop lourd)
      const safeReports = reports.map(r => ({
        id: r.id, title: r.title, type: r.type, description: r.description,
        fileName: r.fileName, fileSize: r.fileSize, submittedBy: r.submittedBy,
        status: r.status, createdAt: r.createdAt,
        hasFile: !!r.fileData
      }));
      res.json(safeReports);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // Admin: télécharger le fichier d'un rapport
  app.get("/api/admin/activity-reports/:id/file", requireAdmin, async (req, res) => {
    try {
      const reports = await storage.getAllActivityReports();
      const report = reports.find(r => r.id === (req.params.id as string));
      if (!report || !report.fileData) {
        return res.status(404).json({ error: "Fichier non trouvé" });
      }
      const parts = report.fileData.split(",");
      const mime = parts[0].match(/:(.*?);/)?.[1] || "application/octet-stream";
      const buffer = Buffer.from(parts[1], "base64");
      res.setHeader("Content-Type", mime);
      res.setHeader("Content-Disposition", `attachment; filename="${report.fileName || 'rapport.pdf'}"`); 
      res.send(buffer);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // Admin: changer le statut d'un rapport
  app.patch("/api/admin/activity-reports/:id/status", requireAdmin, async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) return res.status(400).json({ error: "Statut requis" });
      const updated = await storage.updateActivityReportStatus(req.params.id as string, status);
      if (!updated) return res.status(404).json({ error: "Rapport non trouvé" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  // Admin: supprimer un rapport
  app.delete("/api/admin/activity-reports/:id", requireAdmin, async (req, res) => {
    try {
      await storage.deleteActivityReport(req.params.id as string);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erreur serveur" });
    }
  });

  app.get("/api/debug/thunderbird-stats", requireAdmin, async (_req, res) => {
    try {
      const all = await storage.getThunderbirdApplications();
      const approved = all.filter(a => a.status === "approved");
      res.json({ total: all.length, approved: approved.length, statuses: Array.from(new Set(all.map(a => a.status))) });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  return httpServer;
}

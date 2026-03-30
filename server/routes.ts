import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertMemberSchema, insertContactMessageSchema, insertNewsletterSubscriberSchema,
  insertOpportunitySchema, insertPartnerSchema, insertTrainingSchema,
  insertNewsArticleSchema, insertEventSchema, insertAchievementSchema,
  insertThunderbirdApplicationSchema, insertCandidateSchema, insertVoteSchema
} from "../shared/schema";
import { z } from "zod";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import rateLimit from "express-rate-limit";
import { pool } from "./db";
import { sendNotificationEmail, sendAutoReplyEmail, sendMassEmail, debugSmtpConnection, sendPersonalizedMemberEmails } from "./email";
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
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:;"
    );
    next();
  });

  // ─── Rate Limiters ─────────────────────────────────────────────────────────
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: { error: "Trop de requêtes depuis cette adresse IP, veuillez réessayer plus tard." },
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
      secret: process.env.SESSION_SECRET || "sayc-tchad-secret-key",
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

  app.get("/api/members", async (_req, res) => {
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
      res.json(result);
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

  app.get("/api/debug-email", async (req, res) => {
    const result = await debugSmtpConnection();
    res.json(result);
  });

  app.get("/api/contact", async (_req, res) => {
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

    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || "admin2024";

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
      res.status(500).json({ 
        error: "Erreur lors du dépôt de candidature",
        message: error.message,
        details: error.details || (error.code ? `DB Error Code: ${error.code}` : undefined)
      });
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
  app.get("/api/admin/elections/diagnose", async (_req, res) => {
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
      const members = await storage.getAllMembers();
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
      const { target, subject, message, includeSada } = req.body;
      if (!subject || !message) {
        return res.status(400).json({ error: "Sujet et message requis" });
      }

      let recipients: string[] = [];

      if (target === "members") {
        const members = await storage.getAllMembers();
        recipients = members.map(m => m.email);
      } else if (target === "thunderbird") {
        const apps = await storage.getThunderbirdApplications();
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

  app.get("/api/debug/thunderbird-stats", async (_req, res) => {
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

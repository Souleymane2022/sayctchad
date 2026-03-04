import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertMemberSchema, insertContactMessageSchema, insertNewsletterSubscriberSchema,
  insertOpportunitySchema, insertPartnerSchema, insertTrainingSchema,
  insertNewsArticleSchema, insertEventSchema, insertAchievementSchema
} from "../shared/schema";
import { z } from "zod";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pool } from "./db";
import { sendNotificationEmail, sendAutoReplyEmail } from "./email";
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
    const MemoryStore = require("memorystore")(session);
    sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  } else {
    const PgStore = connectPgSimple(session);
    sessionStore = new PgStore({ pool, createTableIfMissing: true });
  }

  app.use(
    session({
      store: sessionStore,
      secret: process.env.SESSION_SECRET || "sayc-tchad-secret-key",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
    })
  );

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

  app.post("/api/members", async (req, res) => {
    try {
      const validatedData = insertMemberSchema.parse(req.body);
      const existingMember = await storage.getMemberByEmail(validatedData.email);
      if (existingMember) {
        return res.status(400).json({ error: "Un membre avec cet email existe déjà" });
      }
      const member = await storage.createMember(validatedData);

      await sendNotificationEmail(
        "Nouvelle Adhésion - SAYC Tchad",
        `Nouvelle adhésion de ${member.firstName} ${member.lastName} (${member.email}).\nMotivation: ${member.motivation || 'Non spécifiée'}`
      );

      await sendAutoReplyEmail(
        member.email,
        "Confirmation de votre adhésion - SAYC Tchad",
        `Bonjour ${member.firstName},\n\nNous confirmons la bonne réception de votre demande d'adhésion au Smart Africa Youth Chapter Tchad (SAYC Tchad).\n\nNotre équipe étudiera votre demande et vous contactera très prochainement avec la suite des instructions.\n\nCordialement,\nL'équipe SAYC Tchad`
      );

      res.status(201).json(member);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Données invalides", details: error.errors });
      }
      console.error("Error creating member:", error);
      res.status(500).json({ error: "Erreur lors de l'inscription" });
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

  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);

      await sendNotificationEmail(
        "Nouveau Message de Contact - SAYC Tchad",
        `Nouveau message de ${message.firstName} ${message.lastName} (${message.email}).\nSujet: ${message.subject}\nMessage: ${message.message}`
      );

      await sendAutoReplyEmail(
        message.email,
        "Accusé de réception de votre message - SAYC Tchad",
        `Bonjour ${message.firstName},\n\nNous avons bien reçu votre message concernant "${message.subject}".\n\nNotre équipe vous répondra dans les plus brefs délais (généralement sous 48h ouvrables).\n\nCordialement,\nL'équipe SAYC Tchad`
      );

      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Données invalides", details: error.errors });
      }
      console.error("Error creating contact message:", error);
      res.status(500).json({ error: "Erreur lors de l'envoi du message" });
    }
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
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des actualités" });
    }
  });

  app.post("/api/news", requireAdmin, async (req, res) => {
    try {
      const validatedData = insertNewsArticleSchema.parse(req.body);
      const article = await storage.createNewsArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Données invalides", details: error.errors });
      }
      console.error("Error creating news article:", error);
      res.status(500).json({ error: "Erreur lors de la création de l'article" });
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
    try { await storage.deleteOpportunity(req.params.id as string); res.json({ success: true }); }
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
    catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
  });
  app.put("/api/admin/news/:id", requireAdmin, async (req, res) => {
    try { const updated = await storage.updateNewsArticle(req.params.id as string, req.body); res.json(updated); }
    catch (e) { res.status(500).json({ error: "Erreur serveur" }); }
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

  return httpServer;
}

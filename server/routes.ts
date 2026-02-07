import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertMemberSchema, insertContactMessageSchema, insertNewsletterSubscriberSchema, 
  insertOpportunitySchema, insertPartnerSchema, insertTrainingSchema,
  insertNewsArticleSchema, insertEventSchema, insertAchievementSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.post("/api/members", async (req, res) => {
    try {
      const validatedData = insertMemberSchema.parse(req.body);
      const existingMember = await storage.getMemberByEmail(validatedData.email);
      if (existingMember) {
        return res.status(400).json({ error: "Un membre avec cet email existe déjà" });
      }
      const member = await storage.createMember(validatedData);
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

  app.post("/api/opportunities", async (req, res) => {
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
    } catch (error) {
      console.error("Error fetching partners:", error);
      res.status(500).json({ error: "Erreur lors de la récupération des partenaires" });
    }
  });

  app.post("/api/partners", async (req, res) => {
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

  app.post("/api/trainings", async (req, res) => {
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

  app.post("/api/news", async (req, res) => {
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

  app.post("/api/events", async (req, res) => {
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

  app.post("/api/achievements", async (req, res) => {
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

  return httpServer;
}

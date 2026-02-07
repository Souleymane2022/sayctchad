import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMemberSchema, insertContactMessageSchema, insertNewsletterSubscriberSchema, insertOpportunitySchema } from "@shared/schema";
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

  return httpServer;
}

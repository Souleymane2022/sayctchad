import { 
  type User, 
  type InsertUser,
  type Member,
  type InsertMember,
  type ContactMessage,
  type InsertContactMessage,
  type NewsletterSubscriber,
  type InsertNewsletterSubscriber,
  type Opportunity,
  type InsertOpportunity,
  users,
  members,
  contactMessages,
  newsletterSubscribers,
  opportunities
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createMember(member: InsertMember): Promise<Member>;
  getMemberByEmail(email: string): Promise<Member | undefined>;
  getAllMembers(): Promise<Member[]>;
  
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getAllContactMessages(): Promise<ContactMessage[]>;
  
  createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined>;

  createOpportunity(opportunity: InsertOpportunity): Promise<Opportunity>;
  getAllOpportunities(): Promise<Opportunity[]>;
  getActiveOpportunities(): Promise<Opportunity[]>;
  getOpportunityById(id: string): Promise<Opportunity | undefined>;
  updateOpportunity(id: string, data: Partial<InsertOpportunity>): Promise<Opportunity | undefined>;
  deleteOpportunity(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createMember(member: InsertMember): Promise<Member> {
    const [newMember] = await db.insert(members).values(member).returning();
    return newMember;
  }

  async getMemberByEmail(email: string): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.email, email));
    return member;
  }

  async getAllMembers(): Promise<Member[]> {
    return db.select().from(members);
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }

  async getAllContactMessages(): Promise<ContactMessage[]> {
    return db.select().from(contactMessages);
  }

  async createNewsletterSubscriber(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const [newSubscriber] = await db.insert(newsletterSubscribers).values(subscriber).returning();
    return newSubscriber;
  }

  async getNewsletterSubscriberByEmail(email: string): Promise<NewsletterSubscriber | undefined> {
    const [subscriber] = await db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.email, email));
    return subscriber;
  }

  async createOpportunity(opportunity: InsertOpportunity): Promise<Opportunity> {
    const [newOpportunity] = await db.insert(opportunities).values(opportunity).returning();
    return newOpportunity;
  }

  async getAllOpportunities(): Promise<Opportunity[]> {
    return db.select().from(opportunities).orderBy(desc(opportunities.createdAt));
  }

  async getActiveOpportunities(): Promise<Opportunity[]> {
    return db.select().from(opportunities).where(eq(opportunities.isActive, true)).orderBy(desc(opportunities.createdAt));
  }

  async getOpportunityById(id: string): Promise<Opportunity | undefined> {
    const [opportunity] = await db.select().from(opportunities).where(eq(opportunities.id, id));
    return opportunity;
  }

  async updateOpportunity(id: string, data: Partial<InsertOpportunity>): Promise<Opportunity | undefined> {
    const [updated] = await db.update(opportunities).set(data).where(eq(opportunities.id, id)).returning();
    return updated;
  }

  async deleteOpportunity(id: string): Promise<void> {
    await db.delete(opportunities).where(eq(opportunities.id, id));
  }
}

export const storage = new DatabaseStorage();

import {
  type User, type InsertUser,
  type Member, type InsertMember,
  type ContactMessage, type InsertContactMessage,
  type NewsletterSubscriber, type InsertNewsletterSubscriber,
  type Opportunity, type InsertOpportunity,
  type Partner, type InsertPartner,
  type Training, type InsertTraining,
  type NewsArticle, type InsertNewsArticle,
  type Event, type InsertEvent,
  type Achievement, type InsertAchievement,
  type ThunderbirdApplication, type InsertThunderbirdApplication,
  users, members, contactMessages, newsletterSubscribers,
  opportunities, partners, trainings, newsArticles, events, achievements,
  thunderbirdApplications
} from "../shared/schema";
import { db } from "./db";
import { eq, desc, asc } from "drizzle-orm";

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
  getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]>;

  createOpportunity(opportunity: InsertOpportunity): Promise<Opportunity>;
  getAllOpportunities(): Promise<Opportunity[]>;
  getActiveOpportunities(): Promise<Opportunity[]>;
  getOpportunityById(id: string): Promise<Opportunity | undefined>;
  updateOpportunity(id: string, data: Partial<InsertOpportunity>): Promise<Opportunity | undefined>;
  deleteOpportunity(id: string): Promise<void>;

  createPartner(partner: InsertPartner): Promise<Partner>;
  getActivePartners(): Promise<Partner[]>;
  getAllPartners(): Promise<Partner[]>;
  updatePartner(id: string, data: Partial<InsertPartner>): Promise<Partner | undefined>;
  deletePartner(id: string): Promise<void>;

  createTraining(training: InsertTraining): Promise<Training>;
  getActiveTrainings(): Promise<Training[]>;
  getAllTrainings(): Promise<Training[]>;
  updateTraining(id: string, data: Partial<InsertTraining>): Promise<Training | undefined>;
  deleteTraining(id: string): Promise<void>;

  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  getActiveNewsArticles(): Promise<NewsArticle[]>;
  getAllNewsArticles(): Promise<NewsArticle[]>;
  updateNewsArticle(id: string, data: Partial<InsertNewsArticle>): Promise<NewsArticle | undefined>;
  deleteNewsArticle(id: string): Promise<void>;

  createEvent(event: InsertEvent): Promise<Event>;
  getActiveEvents(): Promise<Event[]>;
  getAllEvents(): Promise<Event[]>;
  updateEvent(id: string, data: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<void>;

  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getActiveAchievements(): Promise<Achievement[]>;
  getAllAchievements(): Promise<Achievement[]>;
  updateAchievement(id: string, data: Partial<InsertAchievement>): Promise<Achievement | undefined>;
  deleteAchievement(id: string): Promise<void>;

  createThunderbirdApplication(application: InsertThunderbirdApplication): Promise<ThunderbirdApplication>;
  getThunderbirdApplicationByEmail(email: string): Promise<ThunderbirdApplication | undefined>;
  getAllThunderbirdApplications(): Promise<ThunderbirdApplication[]>;
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
    const membershipId = `SAYC-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    const [newMember] = await db.insert(members).values({ ...member, membershipId }).returning();
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

  async getAllNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
    return db.select().from(newsletterSubscribers);
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

  async createPartner(partner: InsertPartner): Promise<Partner> {
    const [newPartner] = await db.insert(partners).values(partner).returning();
    return newPartner;
  }

  async getActivePartners(): Promise<Partner[]> {
    return db.select().from(partners).where(eq(partners.isActive, true)).orderBy(asc(partners.sortOrder));
  }

  async getAllPartners(): Promise<Partner[]> {
    return db.select().from(partners).orderBy(asc(partners.sortOrder));
  }

  async updatePartner(id: string, data: Partial<InsertPartner>): Promise<Partner | undefined> {
    const [updated] = await db.update(partners).set(data).where(eq(partners.id, id)).returning();
    return updated;
  }

  async deletePartner(id: string): Promise<void> {
    await db.delete(partners).where(eq(partners.id, id));
  }

  async createTraining(training: InsertTraining): Promise<Training> {
    const [newTraining] = await db.insert(trainings).values(training).returning();
    return newTraining;
  }

  async getActiveTrainings(): Promise<Training[]> {
    return db.select().from(trainings).where(eq(trainings.isActive, true)).orderBy(desc(trainings.createdAt));
  }

  async getAllTrainings(): Promise<Training[]> {
    return db.select().from(trainings).orderBy(desc(trainings.createdAt));
  }

  async updateTraining(id: string, data: Partial<InsertTraining>): Promise<Training | undefined> {
    const [updated] = await db.update(trainings).set(data).where(eq(trainings.id, id)).returning();
    return updated;
  }

  async deleteTraining(id: string): Promise<void> {
    await db.delete(trainings).where(eq(trainings.id, id));
  }

  async createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle> {
    const [newArticle] = await db.insert(newsArticles).values(article).returning();
    return newArticle;
  }

  async getActiveNewsArticles(): Promise<NewsArticle[]> {
    return db.select().from(newsArticles).where(eq(newsArticles.isActive, true)).orderBy(desc(newsArticles.createdAt));
  }

  async getAllNewsArticles(): Promise<NewsArticle[]> {
    return db.select().from(newsArticles).orderBy(desc(newsArticles.createdAt));
  }

  async updateNewsArticle(id: string, data: Partial<InsertNewsArticle>): Promise<NewsArticle | undefined> {
    const [updated] = await db.update(newsArticles).set(data).where(eq(newsArticles.id, id)).returning();
    return updated;
  }

  async deleteNewsArticle(id: string): Promise<void> {
    await db.delete(newsArticles).where(eq(newsArticles.id, id));
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async getActiveEvents(): Promise<Event[]> {
    return db.select().from(events).where(eq(events.isActive, true)).orderBy(desc(events.createdAt));
  }

  async getAllEvents(): Promise<Event[]> {
    return db.select().from(events).orderBy(desc(events.createdAt));
  }

  async updateEvent(id: string, data: Partial<InsertEvent>): Promise<Event | undefined> {
    const [updated] = await db.update(events).set(data).where(eq(events.id, id)).returning();
    return updated;
  }

  async deleteEvent(id: string): Promise<void> {
    await db.delete(events).where(eq(events.id, id));
  }

  async createAchievement(achievement: InsertAchievement): Promise<Achievement> {
    const [newAchievement] = await db.insert(achievements).values(achievement).returning();
    return newAchievement;
  }

  async getActiveAchievements(): Promise<Achievement[]> {
    return db.select().from(achievements).where(eq(achievements.isActive, true)).orderBy(desc(achievements.createdAt));
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return db.select().from(achievements).orderBy(desc(achievements.createdAt));
  }

  async updateAchievement(id: string, data: Partial<InsertAchievement>): Promise<Achievement | undefined> {
    const [updated] = await db.update(achievements).set(data).where(eq(achievements.id, id)).returning();
    return updated;
  }

  async deleteAchievement(id: string): Promise<void> {
    await db.delete(achievements).where(eq(achievements.id, id));
  }

  async createThunderbirdApplication(application: InsertThunderbirdApplication): Promise<ThunderbirdApplication> {
    const [newApp] = await db.insert(thunderbirdApplications).values(application).returning();
    return newApp;
  }

  async getThunderbirdApplicationByEmail(email: string): Promise<ThunderbirdApplication | undefined> {
    const [app] = await db.select().from(thunderbirdApplications).where(eq(thunderbirdApplications.email, email));
    return app;
  }

  async getAllThunderbirdApplications(): Promise<ThunderbirdApplication[]> {
    return db.select().from(thunderbirdApplications).orderBy(desc(thunderbirdApplications.createdAt));
  }
}

export const storage = new DatabaseStorage();

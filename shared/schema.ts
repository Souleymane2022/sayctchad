import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const members = pgTable("members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  nomSpecifiqueUnique: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  ageRange: text("age_range").notNull(),
  city: text("city").notNull(),
  education: text("education").notNull(),
  occupation: text("occupation"),
  interests: text("interests").array(),
  motivation: text("motivation"),
  photoUrl: text("photo_url"),
  membershipId: text("membership_id").unique(),
  acceptTerms: boolean("accept_terms").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMemberSchema = createInsertSchema(members).omit({
  id: true,
  createdAt: true,
});

export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof members.$inferSelect;

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  nomSpecifiqueUnique: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).omit({
  id: true,
  createdAt: true,
});

export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;

export const opportunities = pgTable("opportunities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  organization: text("organization").notNull(),
  deadline: text("deadline").notNull(),
  location: text("location"),
  link: text("link"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOpportunitySchema = createInsertSchema(opportunities, {
  title: z.string().min(1, "Titre requis"),
  description: z.string().min(1, "Description requise"),
  category: z.string().min(1, "Catégorie requise"),
  organization: z.string().min(1, "Organisation requise"),
  deadline: z.string().min(1, "Date limite requise"),
  link: z.string().url("URL invalide").optional().or(z.literal("")),
  imageUrl: z.string().optional().or(z.literal("")),
}).omit({
  id: true,
  createdAt: true,
});

export type InsertOpportunity = z.infer<typeof insertOpportunitySchema>;
export type Opportunity = typeof opportunities.$inferSelect;

export const partners = pgTable("partners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  logoUrl: text("logo_url"),
  websiteUrl: text("website_url"),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(99),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPartnerSchema = createInsertSchema(partners).omit({
  id: true,
  createdAt: true,
});

export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type Partner = typeof partners.$inferSelect;

export const trainings = pgTable("trainings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  provider: text("provider").notNull(),
  level: text("level"),
  duration: text("duration"),
  link: text("link"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTrainingSchema = createInsertSchema(trainings, {
  title: z.string().min(1, "Titre requis"),
  description: z.string().min(1, "Description requise"),
  provider: z.string().min(1, "Fournisseur requis"),
  link: z.string().url("URL invalide").optional().or(z.literal("")),
  imageUrl: z.string().optional().or(z.literal("")),
}).omit({
  id: true,
  createdAt: true,
});

export type InsertTraining = z.infer<typeof insertTrainingSchema>;
export type Training = typeof trainings.$inferSelect;

export const newsArticles = pgTable("news_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content"),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  imageUrls: text("image_urls").array(),
  publishedAt: text("published_at").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  createdAt: true,
});

export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;
export type NewsArticle = typeof newsArticles.$inferSelect;

export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  time: text("time"),
  location: text("location"),
  type: text("type").notNull(),
  imageUrl: text("image_url"),
  registrationLink: text("registration_link"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEventSchema = createInsertSchema(events, {
  title: z.string().min(1, "Titre requis"),
  description: z.string().min(1, "Description requise"),
  date: z.string().min(1, "Date requise"),
  type: z.string().min(1, "Type requis"),
  registrationLink: z.string().url("URL invalide").optional().or(z.literal("")),
  imageUrl: z.string().optional().or(z.literal("")),
}).omit({
  id: true,
  createdAt: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  metricValue: text("metric_value").notNull(),
  metricLabel: text("metric_label").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});

export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;

export const thunderbirdApplications = pgTable("thunderbird_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  gender: text("gender").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  city: text("city").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  educationLevel: text("education_level").notNull(),
  schoolOrUniversity: text("school_university"),
  fieldOfStudy: text("field_study"),
  englishLevel: text("english_level").notNull().default("Débutant"),
  hasOnlineExperience: boolean("has_online_experience").notNull(),
  experienceFields: text("experience_fields").array(),
  targetPathway: text("target_pathway").notNull().default("Foundational"),
  motivation: text("motivation").notNull(),
  expectations: text("expectations").notNull(),
  communityImpact: text("community_impact").notNull(),
  timeCommitment: text("time_commitment").notNull().default("5-10h"),
  readyForOnline: boolean("ready_online").notNull(),
  readyForCohort: boolean("ready_cohort").notNull(),
  projectIdea: text("project_idea").notNull(),
  discoverySource: text("discovery_source"),
  consent: boolean("consent").notNull(),
  cohort: text("cohort").notNull().default("Tchad 2024"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertThunderbirdApplicationSchema = createInsertSchema(thunderbirdApplications).omit({
  id: true,
  createdAt: true,
});

export type InsertThunderbirdApplication = z.infer<typeof insertThunderbirdApplicationSchema>;
export type ThunderbirdApplication = typeof thunderbirdApplications.$inferSelect;

export const electionCandidates = pgTable("election_candidates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  nomSpecifiqueUnique: text("last_name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull(), // One of the 5 roles
  photoUrl: text("photo_url").notNull(),
  cvUrl: text("cv_url").notNull(),
  motivationUrl: text("motivation_url").notNull(),
  videoUrl: text("video_url").notNull(),
  programUrl: text("program_url").notNull(),
  linkedInUrl: text("linkedin_url"),
  facebookUrl: text("facebook_url"),
  twitterUrl: text("twitter_url"),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  votesCount: integer("votes_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCandidateSchema = createInsertSchema(electionCandidates, {
  firstName: z.string().min(1, "Prénom requis"),
  nomSpecifiqueUnique: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide").min(1, "Email requis"),
  role: z.string().min(1, "Poste requis"),
  photoUrl: z.string().min(1, "Photo requise"),
  cvUrl: z.string().url("Lien CV invalide").min(1, "Lien CV requis"),
  motivationUrl: z.string().url("Lien motivation invalide").min(1, "Lien motivation requis"),
  videoUrl: z.string().url("Lien vidéo invalide").min(1, "Lien vidéo requis"),
  programUrl: z.string().url("Lien programme invalide").min(1, "Lien programme requis"),
  linkedInUrl: z.string().url("Lien LinkedIn invalide").optional().or(z.literal("")),
  facebookUrl: z.string().url("Lien Facebook invalide").optional().or(z.literal("")),
  twitterUrl: z.string().url("Lien Twitter invalide").optional().or(z.literal("")),
}).omit({
  id: true,
  votesCount: true,
  status: true,
  createdAt: true,
});

export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type ElectionCandidate = typeof electionCandidates.$inferSelect;

export const electionVotes = pgTable("election_votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  voterId: text("voter_id").notNull(), // Member's email or Membership ID
  candidateId: varchar("candidate_id").notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertVoteSchema = createInsertSchema(electionVotes).omit({
  id: true,
  createdAt: true,
});

export type InsertVote = z.infer<typeof insertVoteSchema>;
export type ElectionVote = typeof electionVotes.$inferSelect;

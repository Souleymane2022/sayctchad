CREATE TABLE IF NOT EXISTS "thunderbird_applications" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"gender" text NOT NULL,
	"date_of_birth" text NOT NULL,
	"city" text NOT NULL,
	"phone" text NOT NULL,
	"email" text NOT NULL,
	"education_level" text NOT NULL,
	"school_university" text,
	"field_study" text,
	"english_level" text DEFAULT 'Débutant' NOT NULL,
	"has_online_experience" boolean NOT NULL,
	"experience_fields" text[],
	"target_pathway" text DEFAULT 'Foundational' NOT NULL,
	"motivation" text NOT NULL,
	"expectations" text NOT NULL,
	"community_impact" text NOT NULL,
	"time_commitment" text DEFAULT '5-10h' NOT NULL,
	"ready_online" boolean NOT NULL,
	"ready_cohort" boolean NOT NULL,
	"project_idea" text NOT NULL,
	"discovery_source" text,
	"consent" boolean NOT NULL,
	"cohort" text DEFAULT 'Tchad 2024' NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "election_candidates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"role" text NOT NULL,
	"photo_url" text NOT NULL,
	"cv_url" text NOT NULL,
	"motivation_url" text NOT NULL,
	"video_url" text,
	"program_url" text,
	"linkedin_url" text,
	"facebook_url" text,
	"twitter_url" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"votes_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "election_votes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"voter_id" text NOT NULL,
	"candidate_id" varchar NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);

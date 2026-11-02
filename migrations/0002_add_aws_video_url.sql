-- Ajoute le champ vidéo de présentation (lien YouTube) aux candidatures AWS re/Start.
-- À appliquer sur la base Neon : npm run db:push, ou exécuter ce fichier directement.
ALTER TABLE "aws_restart_applications" ADD COLUMN IF NOT EXISTS "video_url" text;

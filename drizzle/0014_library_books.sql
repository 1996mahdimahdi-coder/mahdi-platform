CREATE TABLE IF NOT EXISTS "library_books" (
  "id" serial PRIMARY KEY,
  "slug" text NOT NULL UNIQUE,
  "title" text NOT NULL,
  "category" text NOT NULL DEFAULT 'عام',
  "short_description" text NOT NULL,
  "description" text,
  "cover_image" text,
  "what_you_learn" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "outline" jsonb NOT NULL DEFAULT '[]'::jsonb,
  "price_dzd" integer NOT NULL DEFAULT 0,
  "published" boolean NOT NULL DEFAULT false,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
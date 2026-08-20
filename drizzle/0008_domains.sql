CREATE TABLE IF NOT EXISTS "domains" (
  "id" serial PRIMARY KEY,
  "slug" text NOT NULL UNIQUE,
  "name_ar" text NOT NULL,
  "icon" text NOT NULL DEFAULT '💼',
  "capital_level" text NOT NULL DEFAULT 'منخفض',
  "definition" text,
  "requirements" text,
  "essentials" text,
  "secondary" text,
  "services" text,
  "regulated" boolean NOT NULL DEFAULT false,
  "sort_order" integer NOT NULL DEFAULT 0,
  "active" boolean NOT NULL DEFAULT true,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);

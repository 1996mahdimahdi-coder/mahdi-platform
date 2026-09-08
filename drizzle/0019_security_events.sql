-- F7 — unified security events (auth, oauth, csrf, rate-limit breaches,
-- admin writes, AI abuse). Written by src/lib/securityLog.ts: console stream
-- first, then a best-effort single-row INSERT (fail-open, so the table can be
-- added lazily). Bounded retention: rows older than 30 days are deleted by the
-- throttled cleanup in securityLog.ts (never fails a request).
CREATE TABLE "security_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"event" text NOT NULL,
	"severity" text DEFAULT 'info' NOT NULL,
	"user_id" integer,
	"payload" jsonb,
	"ip_hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "security_events_created_at_idx" ON "security_events" USING btree ("created_at");
--> statement-breakpoint
CREATE INDEX "security_events_event_idx" ON "security_events" USING btree ("event");
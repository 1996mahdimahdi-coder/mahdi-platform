-- F8 — per-session login records. Every issued session token (nabda_session)
-- is backed by exactly one row keyed by its cryptographically-random jti.
-- Logout retires ONLY the current row via revoked_at, so concurrent sessions
-- from other logins stay alive. users.token_version is left untouched (it
-- remains the user-wide invalidation mechanism reserved for a future
-- "logout everywhere" endpoint). No PII is stored: user_agent_hmac and
-- ip_hash are optional hashes of the user-agent header / client IP only.
--
-- timestamptz (absolute instants): the getSession/revokeSession gates compare
-- against the JS clock; a naive "timestamp" column would skew by the Postgres
-- server's timezone offset.
CREATE TABLE IF NOT EXISTS "sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"jti" text NOT NULL,
	"created_at" timestamptz DEFAULT now() NOT NULL,
	"expires_at" timestamptz NOT NULL,
	"revoked_at" timestamptz,
	"user_agent_hmac" text,
	"ip_hash" text
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_jti_unique" UNIQUE("jti");--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_expires_at_idx" ON "sessions" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "sessions_revoked_at_idx" ON "sessions" USING btree ("revoked_at");
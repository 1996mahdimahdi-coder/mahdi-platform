-- DRAFT: article_sources junction table
-- DO NOT apply to Production — prepare only for future migration.
-- Purpose: Link blog_posts to data_sources (or custom sources) via a many-to-many junction.

CREATE TABLE IF NOT EXISTS article_sources (
  id SERIAL PRIMARY KEY,
  article_id INTEGER NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
  source_name TEXT NOT NULL,               -- e.g. "World Bank", "ONS Algeria"
  source_url TEXT,                          -- optional link to original source
  source_type TEXT NOT NULL DEFAULT 'reference', -- reference, data, image
  relevance TEXT NOT NULL DEFAULT 'supporting', -- supporting, primary, contextual
  accessed_at TIMESTAMPTZ,                  -- when the source was accessed
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(article_id, source_name)
);

CREATE INDEX IF NOT EXISTS idx_article_sources_article ON article_sources(article_id);

-- Sample INSERT (for reference, do NOT run):
-- INSERT INTO article_sources (article_id, source_name, source_url, source_type, relevance, accessed_at)
-- VALUES (1, 'World Bank', 'https://...', 'data', 'primary', '2026-01-15');

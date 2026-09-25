-- Stable page addresses for saints (/saints/<slug>).
-- Backfills every existing saint with the same address the site already derives from the name,
-- so no live URL changes. After this runs, renaming a saint no longer changes its address.
CREATE EXTENSION IF NOT EXISTS unaccent;

ALTER TABLE saints ADD COLUMN IF NOT EXISTS slug TEXT;

UPDATE saints
SET slug = trim(both '-' FROM regexp_replace(lower(unaccent(name)), '[^a-z0-9]+', '-', 'g'))
WHERE slug IS NULL OR slug = '';

CREATE UNIQUE INDEX IF NOT EXISTS saints_slug_key ON saints (slug);

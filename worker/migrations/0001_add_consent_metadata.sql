ALTER TABLE subscribers ADD COLUMN consent_at INTEGER;
ALTER TABLE subscribers ADD COLUMN consent_source TEXT;
ALTER TABLE subscribers ADD COLUMN consent_note TEXT;
ALTER TABLE subscribers ADD COLUMN added_by TEXT;

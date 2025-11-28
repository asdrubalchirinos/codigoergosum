-- Subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
    id TEXT PRIMARY KEY, -- uuid
    email TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'unsubscribed')),
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    confirmed_at INTEGER,
    unsubscribed_at INTEGER
);

-- Tokens table for confirmation and unsubscribe links
CREATE TABLE IF NOT EXISTS tokens (
    id TEXT PRIMARY KEY, -- uuid
    subscriber_id TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('confirm', 'unsubscribe')),
    token TEXT UNIQUE NOT NULL,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    FOREIGN KEY (subscriber_id) REFERENCES subscribers(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tokens_token ON tokens(token);
CREATE INDEX IF NOT EXISTS idx_tokens_subscriber_type ON tokens(subscriber_id, type);

-- Rate limits table
CREATE TABLE IF NOT EXISTS rate_limits (
    ip TEXT PRIMARY KEY,
    count INTEGER NOT NULL DEFAULT 1,
    expires_at INTEGER NOT NULL
);

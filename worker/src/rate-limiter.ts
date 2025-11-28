
export class RateLimiter {
    private db: D1Database;

    constructor(db: D1Database) {
        this.db = db;
    }

    /**
     * Check if an IP has exceeded the rate limit
     * @param ip The IP address to check
     * @param limit Max requests allowed in the window
     * @param windowSeconds Time window in seconds
     * @returns true if allowed, false if limit exceeded
     */
    async check(ip: string, limit: number, windowSeconds: number): Promise<boolean> {
        const now = Math.floor(Date.now() / 1000);

        // Clean up expired records occasionally (probabilistic cleanup to save writes)
        if (Math.random() < 0.1) {
            await this.db.prepare('DELETE FROM rate_limits WHERE expires_at < ?').bind(now).run();
        }

        const record = await this.db.prepare('SELECT * FROM rate_limits WHERE ip = ?').bind(ip).first<{ count: number, expires_at: number }>();

        if (!record) {
            // New record
            await this.db.prepare('INSERT INTO rate_limits (ip, count, expires_at) VALUES (?, 1, ?)')
                .bind(ip, now + windowSeconds)
                .run();
            return true;
        }

        if (record.expires_at < now) {
            // Expired record, reset
            await this.db.prepare('UPDATE rate_limits SET count = 1, expires_at = ? WHERE ip = ?')
                .bind(now + windowSeconds, ip)
                .run();
            return true;
        }

        if (record.count >= limit) {
            return false;
        }

        // Increment count
        await this.db.prepare('UPDATE rate_limits SET count = count + 1 WHERE ip = ?')
            .bind(ip)
            .run();

        return true;
    }
}

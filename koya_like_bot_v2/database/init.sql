CREATE TABLE IF NOT EXISTS guild_settings (
    guild_id VARCHAR(32) PRIMARY KEY,
    welcome_channel_id VARCHAR(32),
    welcome_message TEXT DEFAULT 'Welcome {user} to {server}!',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_profiles (
    guild_id VARCHAR(32) NOT NULL,
    user_id VARCHAR(32) NOT NULL,
    xp BIGINT NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 0,
    coins BIGINT NOT NULL DEFAULT 0,
    last_daily TIMESTAMPTZ,
    PRIMARY KEY (guild_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_rank
ON user_profiles (guild_id, xp DESC);

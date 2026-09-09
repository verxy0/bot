# Koya-like Discord Bot V2

This release expands the V1 foundation with runnable moderation, warning storage, utility/fun commands, basic economy commands, XP/leveling, daily rewards, leaderboard, welcome configuration, PostgreSQL models for warnings/giveaways/tickets, and a cleaner API boundary.

## Stack
- Node.js + discord.js for the Discord gateway/interactions
- Python + FastAPI for the backend API
- PostgreSQL for persistent data
- Redis included as infrastructure for future cache/queues

## Run
1. Copy `.env.example` files and fill Discord credentials.
2. Start infra: `docker compose up -d postgres redis`
3. Backend:
   `cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload`
4. Bot:
   `cd bot && npm install && npm start`

## Important
This is an original Koya-like implementation, not Koya's proprietary source/assets. It focuses on feature parity and a compatible architecture.

## V2 command groups
Moderation: kick, ban, timeout, warn, warnings, purge, slowmode
Economy: balance, work, pay (pay is wired but transaction persistence is not yet complete)
Leveling: profile, rank, leaderboard, message XP
Fun: 8ball, choose, ship
Utility: ping, avatar, userinfo, help
Config: config-welcome

## Database models prepared
guild settings, profiles/inventory, warnings, giveaways, tickets.

## Production checklist
Add Alembic migrations, Redis-backed cooldowns/queues, structured logging, audit log workers, complete ticket/giveaway/role systems, dashboard OAuth2, sharding/worker topology, tests, backup/restore, and security hardening before public deployment.

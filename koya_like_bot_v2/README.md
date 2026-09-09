# Koya-like Discord Bot — V1

Starter project untuk membangun bot Discord bergaya Koya dari nol.

## Stack

- Discord bot: Node.js + discord.js
- Backend/data service: Python + FastAPI
- Database: PostgreSQL
- Cache: Redis
- Deployment lokal: Docker Compose

Dokumentasi resmi discord.js saat ini menyatakan Node.js 24.17.0+ untuk versi dokumentasi utama. FastAPI menyediakan API async dengan dokumentasi OpenAPI otomatis.

## Struktur

```text
koya_like_bot_v1/
├── bot/
│   ├── src/
│   │   ├── commands/
│   │   ├── events/
│   │   ├── lib/
│   │   └── index.js
│   ├── package.json
│   └── .env.example
├── backend/
│   ├── app/
│   │   ├── api.py
│   │   ├── db.py
│   │   ├── models.py
│   │   └── schemas.py
│   ├── requirements.txt
│   └── .env.example
├── database/
│   └── init.sql
├── docker-compose.yml
├── .env.example
└── .gitignore
```

## 1. Buat aplikasi Discord

1. Buka Discord Developer Portal.
2. Create Application.
3. Masuk ke Bot → buat/reset token.
4. Masuk OAuth2 → URL Generator.
5. Pilih scopes: `bot` dan `applications.commands`.
6. Pilih permission minimum yang diperlukan.
7. Simpan token di `bot/.env`.

Jangan pernah commit token ke Git.

## 2. Jalankan dengan Docker

Pastikan Docker Desktop aktif.

```bash
docker compose up -d postgres redis
```

Lalu backend:

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# Linux/macOS:
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.api:app --reload --port 8000
```

Di terminal lain:

```bash
cd bot
npm install
npm start
```

API:
- http://127.0.0.1:8000
- Swagger: http://127.0.0.1:8000/docs

## 3. Konfigurasi

Salin:
- `.env.example` → `.env`
- `bot/.env.example` → `bot/.env`
- `backend/.env.example` → `backend/.env`

Isi:
- DISCORD_TOKEN
- DISCORD_CLIENT_ID
- DISCORD_GUILD_ID (opsional, untuk command development cepat)
- INTERNAL_API_KEY

Untuk development, jika `DISCORD_GUILD_ID` diisi, command didaftarkan ke server tersebut sehingga update command lebih cepat.

## Command V1

- `/ping`
- `/serverinfo`
- `/profile [user]`
- `/rank`
- `/daily`
- `/leaderboard`
- `/config welcome <channel>`

V1 sengaja dibuat sebagai fondasi. Fitur besar seperti moderation, automod, economy lengkap, tickets, reaction roles, music, dashboard web, premium, localization, dan sharding dapat ditambahkan sebagai modul berikutnya.

## Prinsip arsitektur

Bot tidak langsung mengakses PostgreSQL. Bot memanggil FastAPI. FastAPI menjadi data/service layer yang berbicara ke PostgreSQL dan Redis.

Alurnya:

Discord → discord.js → FastAPI → PostgreSQL/Redis

Keuntungannya:
- logic database terpusat
- dashboard bisa memakai API yang sama
- lebih mudah scaling
- bot dan backend bisa di-deploy terpisah

## Produksi

Untuk produksi:
- gunakan secret manager
- jangan expose PostgreSQL/Redis ke internet
- gunakan HTTPS di depan API
- gunakan connection pooling
- tambah rate limiting
- tambah logging/metrics
- gunakan migrations (Alembic)
- gunakan worker/queue untuk pekerjaan berat
- gunakan sharding ketika jumlah guild sudah besar

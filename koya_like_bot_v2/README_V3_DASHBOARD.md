# Koya-like Bot V3 Dashboard

Added a responsive dark web dashboard served by FastAPI at `/`.

Run:
- `docker compose up -d postgres redis`
- `cd backend && pip install -r requirements.txt`
- `uvicorn app.main:app --host 0.0.0.0 --port 8000`
- Open `http://YOUR_SERVER:8000/`

The dashboard currently configures and persists Welcome, Leveling message, AutoMod flags/word list, and Logging channel. It is an original UI, not a copy of Koya's proprietary assets.

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from .api import router
from .db import init_db
from pathlib import Path

app=FastAPI(title="Koya-like Bot API",version="2.1.0")
app.include_router(router)
web_dir=Path(__file__).resolve().parents[2].parent/"web"
if web_dir.exists():
    app.mount("/web",StaticFiles(directory=web_dir),name="web")
    from fastapi.responses import FileResponse
    @app.get("/",include_in_schema=False)
    async def dashboard():
        return FileResponse(web_dir/"index.html")
@app.on_event("startup")
async def startup(): await init_db()

from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta, timezone
from .db import get_session
from .models import UserProfile, GuildSetting, Warning, Giveaway, Ticket
from sqlalchemy import select, desc, func

router = APIRouter(prefix="/api")

class XPIn(BaseModel):
    guild_id: int
    user_id: int
    amount: int = 10

class DailyIn(BaseModel):
    guild_id: int
    user_id: int

class WelcomeIn(BaseModel):
    guild_id: int
    channel_id: int | None = None
    message: str | None = None

class WarnIn(BaseModel):
    guild_id: int
    user_id: int
    moderator_id: int
    reason: str = "No reason provided"

def auth(key: str | None):
    import os
    if key != os.getenv("INTERNAL_API_KEY", "change_this_internal_key"):
        raise HTTPException(401, "invalid internal key")

@router.get("/health")
async def health(): return {"ok": True, "time": datetime.now(timezone.utc).isoformat()}

@router.post("/xp")
async def add_xp(body: XPIn, x_internal_key: str | None = Header(None)):
    auth(x_internal_key)
    async with get_session() as s:
        p = await s.scalar(select(UserProfile).where(UserProfile.guild_id==body.guild_id, UserProfile.user_id==body.user_id))
        if not p:
            p = UserProfile(guild_id=body.guild_id,user_id=body.user_id)
            s.add(p)
        p.xp += max(0, body.amount)
        while p.xp >= 100 + p.level*50:
            p.xp -= 100 + p.level*50
            p.level += 1
            p.coins += 100
        await s.commit()
        return {"level": p.level, "xp": p.xp, "coins": p.coins}

@router.post("/daily")
async def daily(body: DailyIn, x_internal_key: str | None = Header(None)):
    auth(x_internal_key)
    async with get_session() as s:
        p = await s.scalar(select(UserProfile).where(UserProfile.guild_id==body.guild_id, UserProfile.user_id==body.user_id))
        if not p:
            p = UserProfile(guild_id=body.guild_id,user_id=body.user_id); s.add(p)
        now=datetime.now(timezone.utc)
        if p.daily_at and now-p.daily_at < timedelta(hours=24):
            return {"claimed":False,"next":(p.daily_at+timedelta(hours=24)).isoformat()}
        p.coins += 500; p.daily_at=now
        await s.commit()
        return {"claimed":True,"coins":p.coins}

@router.get("/leaderboard/{guild_id}")
async def leaderboard(guild_id:int, limit:int=10):
    async with get_session() as s:
        q=await s.scalars(select(UserProfile).where(UserProfile.guild_id==guild_id).order_by(desc(UserProfile.level),desc(UserProfile.xp)).limit(limit))
        return [{"user_id":p.user_id,"level":p.level,"xp":p.xp,"coins":p.coins} for p in q]

@router.get("/profile/{guild_id}/{user_id}")
async def profile(guild_id:int,user_id:int):
    async with get_session() as s:
        p=await s.scalar(select(UserProfile).where(UserProfile.guild_id==guild_id,UserProfile.user_id==user_id))
        if not p: return {"user_id":user_id,"level":1,"xp":0,"coins":0}
        return {"user_id":p.user_id,"level":p.level,"xp":p.xp,"coins":p.coins}

@router.post("/welcome")
async def welcome(body:WelcomeIn,x_internal_key:str|None=Header(None)):
    auth(x_internal_key)
    async with get_session() as s:
        g=await s.scalar(select(GuildSetting).where(GuildSetting.guild_id==body.guild_id))
        if not g: g=GuildSetting(guild_id=body.guild_id); s.add(g)
        g.welcome_channel_id=body.channel_id; g.welcome_message=body.message
        await s.commit()
        return {"ok":True}

@router.post("/warn")
async def warn(body:WarnIn,x_internal_key:str|None=Header(None)):
    auth(x_internal_key)
    async with get_session() as s:
        w=Warning(**body.model_dump()); s.add(w); await s.commit()
        return {"ok":True}

@router.get("/warnings/{guild_id}/{user_id}")
async def warnings(guild_id:int,user_id:int):
    async with get_session() as s:
        rows=await s.scalars(select(Warning).where(Warning.guild_id==guild_id,Warning.user_id==user_id).order_by(desc(Warning.created_at)))
        return [{"id":w.id,"moderator_id":w.moderator_id,"reason":w.reason,"created_at":w.created_at.isoformat()} for w in rows]


class SettingsOut(BaseModel):
    guild_id: int
    welcome_channel_id: int | None = None
    welcome_message: str | None = None
    log_channel_id: int | None = None
    automod_enabled: bool = False
    automod_words: list[str] = []
    anti_invite: bool = False
    level_message: str = "GG {user}, you reached level {level}!"

@router.get("/settings/{guild_id}", response_model=SettingsOut)
async def get_settings(guild_id:int):
    async with get_session() as s:
        g=await s.scalar(select(GuildSetting).where(GuildSetting.guild_id==guild_id))
        if not g:
            return SettingsOut(guild_id=guild_id)
        return SettingsOut(guild_id=g.guild_id,welcome_channel_id=g.welcome_channel_id,welcome_message=g.welcome_message,log_channel_id=g.log_channel_id,automod_enabled=g.automod_enabled,automod_words=g.automod_words or [],anti_invite=g.anti_invite,level_message=g.level_message)

@router.put("/settings/{guild_id}", response_model=SettingsOut)
async def update_settings(guild_id:int, body:SettingsOut, x_internal_key: str|None=Header(None)):
    auth(x_internal_key)
    async with get_session() as s:
        g=await s.scalar(select(GuildSetting).where(GuildSetting.guild_id==guild_id))
        if not g:
            g=GuildSetting(guild_id=guild_id); s.add(g)
        g.welcome_channel_id=body.welcome_channel_id
        g.welcome_message=body.welcome_message
        g.log_channel_id=body.log_channel_id
        g.automod_enabled=body.automod_enabled
        g.automod_words=body.automod_words
        g.anti_invite=body.anti_invite
        g.level_message=body.level_message
        await s.commit()
        return body

@router.put("/dashboard/settings/{guild_id}", response_model=SettingsOut)
async def dashboard_update_settings(guild_id:int, body:SettingsOut):
    async with get_session() as s:
        g=await s.scalar(select(GuildSetting).where(GuildSetting.guild_id==guild_id))
        if not g: g=GuildSetting(guild_id=guild_id); s.add(g)
        g.welcome_channel_id=body.welcome_channel_id; g.welcome_message=body.welcome_message
        g.log_channel_id=body.log_channel_id; g.automod_enabled=body.automod_enabled
        g.automod_words=body.automod_words; g.anti_invite=body.anti_invite; g.level_message=body.level_message
        await s.commit(); return body

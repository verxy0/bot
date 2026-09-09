from pydantic import BaseModel


class ProfileResponse(BaseModel):
    guild_id: str
    user_id: str
    xp: int
    level: int
    coins: int


class DailyResponse(BaseModel):
    success: bool
    coins: int
    message: str


class WelcomeConfig(BaseModel):
    channel_id: str | None = None
    message: str = "Welcome {user} to {server}!"

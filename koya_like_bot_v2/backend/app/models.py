from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import BigInteger, Integer, String, Text, DateTime, Boolean, JSON
from datetime import datetime, timezone

class Base(DeclarativeBase): pass
class UserProfile(Base):
    __tablename__="user_profiles"
    id:Mapped[int]=mapped_column(primary_key=True)
    guild_id:Mapped[int]=mapped_column(BigInteger,index=True)
    user_id:Mapped[int]=mapped_column(BigInteger,index=True)
    xp:Mapped[int]=mapped_column(Integer,default=0)
    level:Mapped[int]=mapped_column(Integer,default=1)
    coins:Mapped[int]=mapped_column(Integer,default=0)
    daily_at:Mapped[datetime|None]=mapped_column(DateTime(timezone=True),nullable=True)
    inventory:Mapped[dict]=mapped_column(JSON,default=dict)
class GuildSetting(Base):
    __tablename__="guild_settings"
    id:Mapped[int]=mapped_column(primary_key=True)
    guild_id:Mapped[int]=mapped_column(BigInteger,unique=True,index=True)
    welcome_channel_id:Mapped[int|None]=mapped_column(BigInteger,nullable=True)
    welcome_message:Mapped[str|None]=mapped_column(Text,nullable=True)
    log_channel_id:Mapped[int|None]=mapped_column(BigInteger,nullable=True)
    automod_enabled:Mapped[bool]=mapped_column(Boolean,default=False)
    automod_words:Mapped[dict]=mapped_column(JSON,default=list)
    anti_invite:Mapped[bool]=mapped_column(Boolean,default=False)
    level_message:Mapped[str]=mapped_column(Text,default="GG {user}, you reached level {level}!")
class Warning(Base):
    __tablename__="warnings"
    id:Mapped[int]=mapped_column(primary_key=True)
    guild_id:Mapped[int]=mapped_column(BigInteger,index=True)
    user_id:Mapped[int]=mapped_column(BigInteger,index=True)
    moderator_id:Mapped[int]=mapped_column(BigInteger)
    reason:Mapped[str]=mapped_column(Text)
    created_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),default=lambda:datetime.now(timezone.utc))
class Giveaway(Base):
    __tablename__="giveaways"
    id:Mapped[int]=mapped_column(primary_key=True)
    guild_id:Mapped[int]=mapped_column(BigInteger,index=True)
    channel_id:Mapped[int]=mapped_column(BigInteger)
    message_id:Mapped[int]=mapped_column(BigInteger,unique=True)
    prize:Mapped[str]=mapped_column(String(255))
    winners:Mapped[int]=mapped_column(Integer,default=1)
    ends_at:Mapped[datetime]=mapped_column(DateTime(timezone=True))
    ended:Mapped[bool]=mapped_column(Boolean,default=False)
class Ticket(Base):
    __tablename__="tickets"
    id:Mapped[int]=mapped_column(primary_key=True)
    guild_id:Mapped[int]=mapped_column(BigInteger,index=True)
    channel_id:Mapped[int]=mapped_column(BigInteger,unique=True)
    user_id:Mapped[int]=mapped_column(BigInteger)
    status:Mapped[str]=mapped_column(String(32),default="open")
    created_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),default=lambda:datetime.now(timezone.utc))

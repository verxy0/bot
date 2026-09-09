import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from .models import Base
engine=create_async_engine(os.getenv("DATABASE_URL","postgresql+asyncpg://koya:change_this_password@127.0.0.1:5432/koya"))
Session=async_sessionmaker(engine,expire_on_commit=False)
def get_session(): return Session()
async def init_db():
    async with engine.begin() as c: await c.run_sync(Base.metadata.create_all)

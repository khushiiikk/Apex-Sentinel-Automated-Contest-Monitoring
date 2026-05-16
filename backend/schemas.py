from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from sqlalchemy import Column, Integer, String, DateTime, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database Setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./contests.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# SQLAlchemy Models
class ContestDB(Base):
    __tablename__ = "contests"
    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String)
    title = Column(String)
    start_time = Column(String)
    duration = Column(String)
    link = Column(String, unique=True)
    is_bookmarked = Column(Integer, default=0)

Base.metadata.create_all(bind=engine)

# Pydantic Schemas
class ContestBase(BaseModel):
    platform: str
    title: str
    start_time: str
    duration: str
    link: str

class Contest(ContestBase):
    id: int
    is_bookmarked: bool

    class Config:
        orm_mode = True

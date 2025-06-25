from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# Database URL - PostgreSQL in container
DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://pharmatrack:pharmatrack_password@db:5432/pharmatrack"
)

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_database_session():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Create all tables in the database"""
    Base.metadata.create_all(bind=engine)

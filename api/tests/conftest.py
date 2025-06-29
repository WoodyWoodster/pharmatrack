"""Test configuration and fixtures."""

import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

os.environ["DATABASE_URL"] = "sqlite:///:memory:"

from app.database import Base, get_database_session
from main import app
from app.schemas.drug import DrugCreate


SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for testing."""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with database dependency override."""

    def override_get_database_session():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_database_session] = override_get_database_session

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


@pytest.fixture
def sample_drug_data():
    """Sample drug data for testing."""
    return {
        "sku": "TEST-001",
        "name": "Test Medication",
        "generic_name": "test_medication",
        "dosage": "10mg",
        "quantity": 100,
        "expiration_date": "2025-12-31",
        "manufacturer": "Test Pharma",
        "price": 29.99,
        "category": "Pain Relief",
        "description": "Test medication for testing",
    }


@pytest.fixture
def sample_drug_create(sample_drug_data):
    """Sample DrugCreate schema for testing."""
    return DrugCreate(**sample_drug_data)


@pytest.fixture
def sample_drug(db_session, sample_drug_data):
    """Create a sample drug in the database."""
    from app.models.drug import Drug

    drug = Drug(**sample_drug_data)
    db_session.add(drug)
    db_session.commit()
    db_session.refresh(drug)
    return drug

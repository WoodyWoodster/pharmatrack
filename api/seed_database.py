#!/usr/bin/env python3
"""
Database seeding script for PharmaTrack
Run this script to populate the database with initial test data

Usage:
  # From the api directory:
  python seed_database.py

  # Or from within the Docker container:
  docker exec -it pharmatrack-api python seed_database.py
"""

import sys
import os
from datetime import date

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app.database import SessionLocal, create_tables, engine
    from app.models.drug import Drug
    from sqlalchemy import text
except ImportError as e:
    print(f"Error importing modules: {e}")
    print("Make sure you're running this script from the api directory")
    sys.exit(1)


def test_database_connection():
    """Test if we can connect to the database"""
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            return True
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False


def seed_database():
    """Seed the database with initial drug data"""
    print("Starting database seeding process...")

    if not test_database_connection():
        print("Cannot connect to database. Make sure PostgreSQL is running.")
        print(
            "If using Docker: docker-compose -f docker-compose.yml -f docker-compose.dev.yml up db"
        )
        return False

    print("Creating database tables...")
    create_tables()

    db = SessionLocal()

    try:
        existing_count = db.query(Drug).count()
        if existing_count > 0:
            print(f"Database already contains {existing_count} drugs. Skipping seed.")
            return True

        print("Seeding database with initial drug data...")

        initial_drugs = [
            Drug(
                name="Amoxicillin",
                generic_name="Amoxicillin",
                dosage="500mg",
                quantity=150,
                expiration_date=date(2025, 8, 15),
                manufacturer="PharmaCorp",
                price=12.99,
                category="Antibiotic",
                description="Broad-spectrum antibiotic for bacterial infections",
            ),
            Drug(
                name="Lisinopril",
                generic_name="Lisinopril",
                dosage="10mg",
                quantity=200,
                expiration_date=date(2025, 12, 1),
                manufacturer="MediGen",
                price=8.50,
                category="ACE Inhibitor",
                description="Used to treat high blood pressure and heart failure",
            ),
            Drug(
                name="Metformin",
                generic_name="Metformin HCl",
                dosage="850mg",
                quantity=75,
                expiration_date=date(2025, 6, 30),
                manufacturer="DiabetesCare",
                price=15.25,
                category="Antidiabetic",
                description="First-line treatment for type 2 diabetes",
            ),
            Drug(
                name="Ibuprofen",
                generic_name="Ibuprofen",
                dosage="200mg",
                quantity=300,
                expiration_date=date(2026, 3, 20),
                manufacturer="PainRelief Inc",
                price=6.99,
                category="NSAID",
                description="Anti-inflammatory pain reliever",
            ),
            Drug(
                name="Acetaminophen",
                generic_name="Acetaminophen",
                dosage="500mg",
                quantity=250,
                expiration_date=date(2025, 11, 15),
                manufacturer="PainRelief Inc",
                price=5.99,
                category="Analgesic",
                description="Pain reliever and fever reducer",
            ),
            Drug(
                name="Amlodipine",
                generic_name="Amlodipine Besylate",
                dosage="5mg",
                quantity=80,
                expiration_date=date(2025, 9, 10),
                manufacturer="CardioMed",
                price=18.75,
                category="Antihypertensive",
                description="Calcium channel blocker for hypertension",
            ),
            Drug(
                name="Atorvastatin",
                generic_name="Atorvastatin Calcium",
                dosage="20mg",
                quantity=120,
                expiration_date=date(2025, 10, 5),
                manufacturer="CholesterolCare",
                price=22.50,
                category="Statin",
                description="Used to lower cholesterol and reduce cardiovascular risk",
            ),
            Drug(
                name="Omeprazole",
                generic_name="Omeprazole",
                dosage="20mg",
                quantity=90,
                expiration_date=date(2025, 7, 20),
                manufacturer="GastroCare",
                price=14.25,
                category="Proton Pump Inhibitor",
                description="Reduces stomach acid production",
            ),
        ]

        for drug in initial_drugs:
            db.add(drug)

        db.commit()

        print(f"✅ Successfully seeded database with {len(initial_drugs)} drugs.")
        return True

    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
        return False
    finally:
        db.close()


if __name__ == "__main__":
    print("PharmaTrack Database Seeding Script")
    print("=" * 40)
    print(
        f"Database URL: {os.getenv('DATABASE_URL', 'postgresql://pharmatrack:pharmatrack_password@db:5432/pharmatrack')}"
    )
    print()

    success = seed_database()

    if success:
        print("\n🎉 Database seeding completed successfully!")
        print("You can now start the API server and frontend.")
    else:
        print("\n💥 Database seeding failed!")
        sys.exit(1)

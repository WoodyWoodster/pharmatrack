from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from app.models.drug import Drug
from app.schemas.drug import DrugCreate, DrugUpdate
from app.repositories.drug_interface import DrugRepositoryInterface


class DrugRepository(DrugRepositoryInterface):
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Drug]:
        """Get all drugs from the database"""
        return self.db.query(Drug).order_by(Drug.created_at.desc()).all()

    def get_by_id(self, drug_id: int) -> Optional[Drug]:
        """Get a drug by ID"""
        return self.db.query(Drug).filter(Drug.id == drug_id).first()

    def get_by_sku(self, sku: str) -> Optional[Drug]:
        """Get a drug by SKU"""
        return self.db.query(Drug).filter(Drug.sku == sku).first()

    def get_by_name(self, name: str) -> Optional[Drug]:
        """Get a drug by name"""
        return self.db.query(Drug).filter(Drug.name == name).first()

    def search(self, query: str) -> List[Drug]:
        """Search drugs by name, generic name, or manufacturer"""
        search_pattern = f"%{query}%"
        return (
            self.db.query(Drug)
            .filter(
                or_(
                    Drug.name.ilike(search_pattern),
                    Drug.generic_name.ilike(search_pattern),
                    Drug.manufacturer.ilike(search_pattern),
                )
            )
            .order_by(Drug.created_at.desc())
            .all()
        )

    def filter_by_category(self, category: str) -> List[Drug]:
        """Filter drugs by category"""
        return self.db.query(Drug).filter(Drug.category == category).all()

    def get_low_stock(self, threshold: int = 100) -> List[Drug]:
        """Get drugs with quantity below threshold"""
        return self.db.query(Drug).filter(Drug.quantity < threshold).all()

    def create(self, drug_data: DrugCreate) -> Drug:
        """Create a new drug"""
        db_drug = Drug(**drug_data.model_dump())
        self.db.add(db_drug)
        self.db.commit()
        self.db.refresh(db_drug)
        return db_drug

    def batch_create(self, drugs_data: List[DrugCreate]) -> List[Drug]:
        """Create multiple drugs efficiently in a single transaction"""
        if not drugs_data:
            return []

        db_drugs = [Drug(**drug_data.model_dump()) for drug_data in drugs_data]

        try:
            self.db.add_all(db_drugs)
            self.db.commit()

            for drug in db_drugs:
                self.db.refresh(drug)

        except Exception as e:
            self.db.rollback()
            raise e

        return db_drugs

    def update(self, drug_id: int, drug_data: DrugUpdate) -> Optional[Drug]:
        """Update an existing drug"""
        db_drug = self.get_by_id(drug_id)
        if not db_drug:
            return None

        if drug_data.sku and drug_data.sku != db_drug.sku:
            existing_drug_with_sku = self.get_by_sku(drug_data.sku)
            if existing_drug_with_sku and existing_drug_with_sku.id != drug_id:
                raise ValueError("SKU already exists")

        update_data = drug_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_drug, field, value)

        self.db.commit()
        self.db.refresh(db_drug)
        return db_drug

    def delete(self, drug_id: int) -> bool:
        """Delete a drug by ID"""
        db_drug = self.get_by_id(drug_id)
        if not db_drug:
            return False

        self.db.delete(db_drug)
        self.db.commit()
        return True

    def exists(self, sku: str) -> bool:
        """Check if a drug with the given SKU already exists"""
        query = self.db.query(Drug).filter(Drug.sku == sku)
        return query.first() is not None

    def check_existing_skus(self, skus: List[str]) -> List[str]:
        """Check which SKUs already exist in the database"""
        if not skus:
            return []

        existing_drugs = self.db.query(Drug.sku).filter(Drug.sku.in_(skus)).all()
        return [drug.sku for drug in existing_drugs]

    def get_paginated(
        self, page: int = 1, page_size: int = 50
    ) -> tuple[List[Drug], int]:
        """Get paginated drugs with total count"""
        offset = (page - 1) * page_size

        total = self.db.query(Drug).count()

        drugs = (
            self.db.query(Drug)
            .order_by(Drug.created_at.desc())
            .offset(offset)
            .limit(page_size)
            .all()
        )

        return drugs, total

    def search_paginated(
        self, query: str, page: int = 1, page_size: int = 50
    ) -> tuple[List[Drug], int]:
        """Search drugs with pagination"""
        search_pattern = f"%{query}%"
        offset = (page - 1) * page_size

        base_query = self.db.query(Drug).filter(
            or_(
                Drug.name.ilike(search_pattern),
                Drug.generic_name.ilike(search_pattern),
                Drug.manufacturer.ilike(search_pattern),
            )
        )

        total = base_query.count()

        drugs = (
            base_query.order_by(Drug.created_at.desc())
            .offset(offset)
            .limit(page_size)
            .all()
        )

        return drugs, total

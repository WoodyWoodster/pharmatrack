from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.drug import Drug
from app.schemas.drug import DrugCreate, DrugUpdate


class DrugRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> List[Drug]:
        """Get all drugs from the database"""
        return self.db.query(Drug).all()

    def get_by_id(self, drug_id: int) -> Optional[Drug]:
        """Get a drug by ID"""
        return self.db.query(Drug).filter(Drug.id == drug_id).first()

    def get_by_name(self, name: str) -> Optional[Drug]:
        """Get a drug by name"""
        return self.db.query(Drug).filter(Drug.name == name).first()

    def search(self, query: str) -> List[Drug]:
        """Search drugs by name, generic name, or manufacturer"""
        search_pattern = f"%{query}%"
        return (
            self.db.query(Drug)
            .filter(
                (Drug.name.ilike(search_pattern))
                | (Drug.generic_name.ilike(search_pattern))
                | (Drug.manufacturer.ilike(search_pattern))
            )
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

    def update(self, drug_id: int, drug_data: DrugUpdate) -> Optional[Drug]:
        """Update an existing drug"""
        db_drug = self.get_by_id(drug_id)
        if not db_drug:
            return None

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

    def exists(self, name: str, exclude_id: Optional[int] = None) -> bool:
        """Check if a drug with the given name already exists"""
        query = self.db.query(Drug).filter(Drug.name == name)
        if exclude_id:
            query = query.filter(Drug.id != exclude_id)
        return query.first() is not None

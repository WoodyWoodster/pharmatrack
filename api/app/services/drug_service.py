from typing import List, Optional
from fastapi import HTTPException
from app.repositories.drug_interface import DrugRepositoryInterface
from app.schemas.drug import DrugCreate, DrugUpdate, DrugResponse
from datetime import datetime


class DrugService:
    def __init__(self, repository: DrugRepositoryInterface):
        self.repository = repository

    def get_all_drugs(self) -> List[DrugResponse]:
        """Get all drugs"""
        drugs = self.repository.get_all()
        return [DrugResponse.model_validate(drug) for drug in drugs]

    def get_drug_by_id(self, drug_id: int) -> DrugResponse:
        """Get a drug by ID"""
        drug = self.repository.get_by_id(drug_id)
        if not drug:
            raise HTTPException(status_code=404, detail="Drug not found")
        return DrugResponse.model_validate(drug)

    def search_drugs(
        self, query: str, category: Optional[str] = None
    ) -> List[DrugResponse]:
        """Search drugs with optional category filter"""
        if query:
            drugs = self.repository.search(query)
        else:
            drugs = self.repository.get_all()

        if category and category != "All":
            drugs = [drug for drug in drugs if drug.category == category]

        return [DrugResponse.model_validate(drug) for drug in drugs]

    def get_low_stock_drugs(self, threshold: int = 100) -> List[DrugResponse]:
        """Get drugs with low stock"""
        drugs = self.repository.get_low_stock(threshold)
        return [DrugResponse.model_validate(drug) for drug in drugs]

    def get_expiring_soon_drugs(self, days: int = 90) -> List[DrugResponse]:
        """Get drugs expiring within the specified number of days"""
        all_drugs = self.repository.get_all()
        expiring_drugs = []

        current_date = datetime.now().date()

        for drug in all_drugs:
            try:
                exp_date = datetime.strptime(drug.expiration_date, "%Y-%m-%d").date()
                days_until_expiry = (exp_date - current_date).days
                if 0 <= days_until_expiry <= days:
                    expiring_drugs.append(drug)
            except ValueError:
                continue

        return [DrugResponse.model_validate(drug) for drug in expiring_drugs]

    def create_drug(self, drug_data: DrugCreate) -> DrugResponse:
        """Create a new drug with validation"""

        if self.repository.exists(drug_data.sku):
            raise HTTPException(
                status_code=400,
                detail=f"Drug with SKU '{drug_data.sku}' already exists",
            )

        self._validate_expiration_date(drug_data.expiration_date)

        drug = self.repository.create(drug_data)
        return DrugResponse.model_validate(drug)

    def batch_create_drugs(self, drugs_data: List[DrugCreate]) -> List[DrugResponse]:
        """Create multiple drugs in a batch with validation"""
        if not drugs_data:
            raise HTTPException(status_code=400, detail="No drug data provided")

        skus = [drug_data.sku for drug_data in drugs_data]

        seen_skus = set()
        for sku in skus:
            if sku in seen_skus:
                raise HTTPException(
                    status_code=400,
                    detail=f"Duplicate SKU '{sku}' in batch data",
                )
            seen_skus.add(sku)

        existing_skus = self.repository.check_existing_skus(skus)
        if existing_skus:
            raise HTTPException(
                status_code=400,
                detail=f"SKUs already exist in database: {', '.join(existing_skus)}",
            )

        for drug_data in drugs_data:
            self._validate_expiration_date(drug_data.expiration_date)

        created_drugs = self.repository.batch_create(drugs_data)
        return [DrugResponse.model_validate(drug) for drug in created_drugs]

    def update_drug(self, drug_id: int, drug_data: DrugUpdate) -> DrugResponse:
        """Update an existing drug"""
        existing_drug = self.repository.get_by_id(drug_id)
        if not existing_drug:
            raise HTTPException(status_code=404, detail="Drug not found")

        if drug_data.expiration_date:
            self._validate_expiration_date(drug_data.expiration_date)

        try:
            updated_drug = self.repository.update(drug_id, drug_data)
            if not updated_drug:
                raise HTTPException(status_code=404, detail="Drug not found")
        except ValueError as e:
            if "SKU already exists" in str(e):
                raise HTTPException(
                    status_code=400,
                    detail=f"Drug with SKU '{drug_data.sku}' already exists",
                )
            raise

        return DrugResponse.model_validate(updated_drug)

    def delete_drug(self, drug_id: int) -> dict:
        """Delete a drug"""
        if not self.repository.delete(drug_id):
            raise HTTPException(status_code=404, detail="Drug not found")
        return {"message": "Drug deleted successfully"}

    def get_categories(self) -> List[str]:
        """Get all unique categories"""
        drugs = self.repository.get_all()
        categories = list(set(drug.category for drug in drugs))
        return sorted(categories)

    def _validate_expiration_date(self, expiration_date: str) -> None:
        """Validate expiration date format and ensure it's not in the past"""
        try:
            exp_date = datetime.strptime(expiration_date, "%Y-%m-%d").date()
            current_date = datetime.now().date()

            if exp_date < current_date:
                raise HTTPException(
                    status_code=400, detail="Expiration date cannot be in the past"
                )
        except ValueError:
            raise HTTPException(
                status_code=400, detail="Invalid expiration date format. Use YYYY-MM-DD"
            )

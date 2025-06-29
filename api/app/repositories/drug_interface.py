"""Interface for drug repository operations."""

from abc import ABC, abstractmethod
from typing import List, Optional
from app.models.drug import Drug
from app.schemas.drug import DrugCreate, DrugUpdate


class DrugRepositoryInterface(ABC):
    """Abstract interface for drug repository operations."""

    @abstractmethod
    def get_all(self) -> List[Drug]:
        """Get all drugs from the database."""
        pass

    @abstractmethod
    def get_by_id(self, drug_id: int) -> Optional[Drug]:
        """Get a drug by ID."""
        pass

    @abstractmethod
    def get_by_sku(self, sku: str) -> Optional[Drug]:
        """Get a drug by SKU."""
        pass

    @abstractmethod
    def create(self, drug_data: DrugCreate) -> Drug:
        """Create a new drug."""
        pass

    @abstractmethod
    def update(self, drug_id: int, drug_data: DrugUpdate) -> Optional[Drug]:
        """Update an existing drug."""
        pass

    @abstractmethod
    def delete(self, drug_id: int) -> bool:
        """Delete a drug by ID."""
        pass

    @abstractmethod
    def search(self, query: str) -> List[Drug]:
        """Search drugs by name, generic name, or manufacturer."""
        pass

    @abstractmethod
    def filter_by_category(self, category: str) -> List[Drug]:
        """Filter drugs by category."""
        pass

    @abstractmethod
    def get_low_stock(self, threshold: int = 100) -> List[Drug]:
        """Get drugs with quantity below threshold."""
        pass

    @abstractmethod
    def exists(self, sku: str) -> bool:
        """Check if a drug with the given SKU already exists."""
        pass

    @abstractmethod
    def batch_create(self, drugs_data: List[DrugCreate]) -> List[Drug]:
        """Create multiple drugs efficiently in a single transaction."""
        pass

    @abstractmethod
    def check_existing_skus(self, skus: List[str]) -> List[str]:
        """Check which SKUs already exist in the database."""
        pass

    @abstractmethod
    def get_paginated(
        self, page: int = 1, page_size: int = 50
    ) -> tuple[List[Drug], int]:
        """Get paginated drugs with total count."""
        pass

    @abstractmethod
    def search_paginated(
        self, query: str, page: int = 1, page_size: int = 50
    ) -> tuple[List[Drug], int]:
        """Search drugs with pagination."""
        pass

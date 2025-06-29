"""Tests for drug service."""

import pytest

from app.services.drug_service import DrugService
from app.schemas.drug import DrugCreate, DrugUpdate
from fastapi import HTTPException


class TestDrugService:
    """Test cases for DrugService."""

    @pytest.fixture(autouse=True)
    def setup(self, db_session):
        """Set up service for each test."""
        self.service = DrugService(db_session)

    def test_create_drug_success(self, sample_drug_create):
        """Test successful drug creation."""
        drug_response = self.service.create_drug(sample_drug_create)

        assert drug_response.id is not None
        assert drug_response.sku == sample_drug_create.sku
        assert drug_response.name == sample_drug_create.name

    def test_create_drug_duplicate_sku(self, sample_drug, sample_drug_create):
        """Test creating drug with duplicate SKU raises error."""
        with pytest.raises(HTTPException) as exc_info:
            self.service.create_drug(sample_drug_create)
        assert exc_info.value.status_code == 400
        assert "already exists" in str(exc_info.value.detail)

    def test_create_drug_invalid_price(self, sample_drug_data):
        """Test creating drug with invalid price raises error."""
        sample_drug_data["price"] = -10.0

        with pytest.raises(ValueError):
            DrugCreate(**sample_drug_data)

    def test_create_drug_invalid_quantity(self, sample_drug_data):
        """Test creating drug with invalid quantity raises error."""
        sample_drug_data["quantity"] = -5

        with pytest.raises(ValueError):
            DrugCreate(**sample_drug_data)

    def test_create_drug_invalid_expiration_date(self, sample_drug_data):
        """Test creating drug with invalid expiration date raises error."""
        sample_drug_data["expiration_date"] = "2020-01-01"
        drug_create = DrugCreate(**sample_drug_data)

        with pytest.raises(HTTPException) as exc_info:
            self.service.create_drug(drug_create)
        assert exc_info.value.status_code == 400
        assert "cannot be in the past" in str(exc_info.value.detail)

    def test_get_drug_by_id_success(self, sample_drug):
        """Test successful drug retrieval by ID."""
        drug_response = self.service.get_drug_by_id(sample_drug.id)

        assert drug_response is not None
        assert drug_response.id == sample_drug.id
        assert drug_response.name == sample_drug.name

    def test_get_drug_by_id_not_found(self):
        """Test drug retrieval with non-existent ID raises error."""
        with pytest.raises(HTTPException) as exc_info:
            self.service.get_drug_by_id(999)
        assert exc_info.value.status_code == 404

    def test_update_drug_success(self, sample_drug):
        """Test successful drug update."""
        update_data = DrugUpdate(name="Updated Medicine", price=45.99, quantity=200)

        updated_drug = self.service.update_drug(sample_drug.id, update_data)

        assert updated_drug.name == "Updated Medicine"
        assert updated_drug.price == 45.99
        assert updated_drug.quantity == 200

    def test_update_drug_not_found(self):
        """Test updating non-existent drug raises error."""
        update_data = DrugUpdate(name="Won't work")
        with pytest.raises(HTTPException) as exc_info:
            self.service.update_drug(999, update_data)
        assert exc_info.value.status_code == 404

    def test_update_drug_duplicate_sku(self, sample_drug):
        """Test updating drug with duplicate SKU raises error."""
        other_drug_data = DrugCreate(
            sku="OTHER-001",
            name="Other Drug",
            generic_name="other_drug",
            dosage="5mg",
            quantity=50,
            expiration_date="2025-12-31",
            manufacturer="Other Pharma",
            price=19.99,
            category="Other",
        )
        self.service.create_drug(other_drug_data)

        update_data = DrugUpdate(sku="OTHER-001")
        with pytest.raises(HTTPException) as exc_info:
            self.service.update_drug(sample_drug.id, update_data)
        assert exc_info.value.status_code == 400

    def test_update_drug_invalid_price(self, sample_drug_data):
        """Test updating drug with invalid price raises error."""
        with pytest.raises(ValueError):
            DrugUpdate(price=-5.0)

    def test_update_drug_invalid_quantity(self, sample_drug_data):
        """Test updating drug with invalid quantity raises error."""
        with pytest.raises(ValueError):
            DrugUpdate(quantity=-10)

    def test_update_drug_invalid_expiration_date(self, sample_drug):
        """Test updating drug with invalid expiration date raises error."""
        update_data = DrugUpdate(expiration_date="2020-01-01")
        with pytest.raises(HTTPException) as exc_info:
            self.service.update_drug(sample_drug.id, update_data)
        assert exc_info.value.status_code == 400

    def test_delete_drug_success(self, sample_drug):
        """Test successful drug deletion."""
        result = self.service.delete_drug(sample_drug.id)
        assert "message" in result

    def test_delete_drug_not_found(self):
        """Test deleting non-existent drug raises error."""
        with pytest.raises(HTTPException) as exc_info:
            self.service.delete_drug(999)
        assert exc_info.value.status_code == 404

    def test_search_drugs_by_name(self, sample_drug):
        """Test searching drugs by name."""
        results = self.service.search_drugs("Test")

        assert len(results) == 1
        assert results[0].name == sample_drug.name

    def test_search_drugs_by_category(self, sample_drug):
        """Test searching drugs by category."""
        results = self.service.search_drugs("", "Pain Relief")

        assert len(results) == 1
        assert results[0].category == "Pain Relief"

    def test_search_drugs_with_both_filters(self, sample_drug):
        """Test searching drugs with both name and category filters."""
        other_drug_data = DrugCreate(
            sku="TEST-VIT",
            name="Test Vitamin",
            generic_name="test_vitamin",
            dosage="100mg",
            quantity=150,
            expiration_date="2025-12-31",
            manufacturer="Vitamin Corp",
            price=12.99,
            category="Vitamins",
        )
        self.service.create_drug(other_drug_data)

        results = self.service.search_drugs("Test", "Pain Relief")
        assert len(results) == 1
        assert results[0].category == "Pain Relief"

    def test_get_all_drugs(self, sample_drug):
        """Test retrieving all drugs."""
        other_drug_data = DrugCreate(
            sku="OTHER-002",
            name="Another Drug",
            generic_name="another_drug",
            dosage="25mg",
            quantity=75,
            expiration_date="2025-09-30",
            manufacturer="Another Corp",
            price=22.50,
            category="Other",
        )
        self.service.create_drug(other_drug_data)

        all_drugs = self.service.get_all_drugs()
        assert len(all_drugs) == 2

    def test_get_categories(self, sample_drug):
        """Test getting all drug categories."""
        other_drug_data = DrugCreate(
            sku="VIT-001",
            name="Vitamin D",
            generic_name="vitamin_d",
            dosage="1000IU",
            quantity=200,
            expiration_date="2025-12-31",
            manufacturer="Vitamin Corp",
            price=15.99,
            category="Vitamins",
        )
        self.service.create_drug(other_drug_data)

        categories = self.service.get_categories()
        assert "Pain Relief" in categories
        assert "Vitamins" in categories
        assert len(categories) == 2

    def test_get_low_stock_drugs(self, sample_drug):
        """Test getting low stock drugs."""
        low_stock_data = DrugCreate(
            sku="LOW-001",
            name="Low Stock Drug",
            generic_name="low_stock",
            dosage="50mg",
            quantity=50,
            expiration_date="2025-12-31",
            manufacturer="Low Corp",
            price=25.99,
            category="Other",
        )
        self.service.create_drug(low_stock_data)

        low_stock_drugs = self.service.get_low_stock_drugs()
        assert len(low_stock_drugs) == 1
        assert low_stock_drugs[0].quantity == 50

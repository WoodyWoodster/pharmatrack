"""Tests for drug service layer."""

import pytest
from fastapi import HTTPException
from app.services.drug_service import DrugService
from app.repositories.drug_repository import DrugRepository
from app.schemas.drug import DrugCreate, DrugUpdate


class TestDrugService:
    """Test cases for DrugService business logic."""

    @pytest.fixture(autouse=True)
    def setup(self, db_session):
        """Set up the service for each test."""
        repository = DrugRepository(db_session)
        self.service = DrugService(repository)

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

    def test_delete_drug_success(self, sample_drug):
        """Test successful drug deletion."""
        result = self.service.delete_drug(sample_drug.id)

        assert result["message"] == "Drug deleted successfully"

        with pytest.raises(HTTPException):
            self.service.get_drug_by_id(sample_drug.id)

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

    def test_get_low_stock_drugs(self):
        """Test getting drugs with low stock."""
        low_stock_drug_data = DrugCreate(
            sku="LOW-001",
            name="Low Stock Drug",
            generic_name="low_stock_drug",
            dosage="5mg",
            quantity=50,
            expiration_date="2025-07-31",
            manufacturer="Low Stock Corp",
            price=8.99,
            category="Other",
        )
        self.service.create_drug(low_stock_drug_data)

        low_stock_drugs = self.service.get_low_stock_drugs(threshold=100)
        assert len(low_stock_drugs) == 1
        assert low_stock_drugs[0].quantity == 50

    def test_get_categories(self, sample_drug):
        """Test getting all drug categories."""
        vitamin_drug_data = DrugCreate(
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
        self.service.create_drug(vitamin_drug_data)

        categories = self.service.get_categories()
        assert len(categories) == 2
        assert "Pain Relief" in categories
        assert "Vitamins" in categories

    def test_batch_create_drugs_success(self):
        """Test successful batch drug creation."""
        drugs_data = [
            DrugCreate(
                sku="BATCH-001",
                name="Batch Drug 1",
                generic_name="batch_drug_1",
                dosage="10mg",
                quantity=100,
                expiration_date="2025-12-31",
                manufacturer="Batch Pharma",
                price=29.99,
                category="Antibiotic",
            ),
            DrugCreate(
                sku="BATCH-002",
                name="Batch Drug 2",
                generic_name="batch_drug_2",
                dosage="20mg",
                quantity=150,
                expiration_date="2025-11-30",
                manufacturer="Batch Pharma",
                price=39.99,
                category="NSAID",
            ),
        ]

        results = self.service.batch_create_drugs(drugs_data)

        assert len(results) == 2
        assert results[0].sku == "BATCH-001"
        assert results[1].sku == "BATCH-002"
        assert all(drug.id is not None for drug in results)

    def test_batch_create_drugs_empty_list(self):
        """Test batch creation with empty list raises error."""
        with pytest.raises(HTTPException) as exc_info:
            self.service.batch_create_drugs([])
        assert exc_info.value.status_code == 400
        assert "No drug data provided" in str(exc_info.value.detail)

    def test_batch_create_drugs_duplicate_skus_in_batch(self):
        """Test batch creation with duplicate SKUs within batch raises error."""
        drugs_data = [
            DrugCreate(
                sku="DUPLICATE-001",
                name="Drug 1",
                generic_name="drug_1",
                dosage="10mg",
                quantity=100,
                expiration_date="2025-12-31",
                manufacturer="Test Pharma",
                price=29.99,
                category="Antibiotic",
            ),
            DrugCreate(
                sku="DUPLICATE-001",
                name="Drug 2",
                generic_name="drug_2",
                dosage="20mg",
                quantity=150,
                expiration_date="2025-11-30",
                manufacturer="Test Pharma",
                price=39.99,
                category="NSAID",
            ),
        ]

        with pytest.raises(HTTPException) as exc_info:
            self.service.batch_create_drugs(drugs_data)
        assert exc_info.value.status_code == 400
        assert "Duplicate SKU 'DUPLICATE-001' in batch data" in str(
            exc_info.value.detail
        )

    def test_batch_create_drugs_existing_sku_in_database(self, sample_drug):
        """Test batch creation with SKU that already exists in database."""
        drugs_data = [
            DrugCreate(
                sku="TEST-001",
                name="New Drug",
                generic_name="new_drug",
                dosage="10mg",
                quantity=100,
                expiration_date="2025-12-31",
                manufacturer="Test Pharma",
                price=29.99,
                category="Antibiotic",
            ),
        ]

        with pytest.raises(HTTPException) as exc_info:
            self.service.batch_create_drugs(drugs_data)
        assert exc_info.value.status_code == 400
        assert "already exist in database" in str(exc_info.value.detail)
        assert "TEST-001" in str(exc_info.value.detail)

    def test_batch_create_drugs_invalid_expiration_date(self):
        """Test batch creation with invalid expiration date raises error."""
        drugs_data = [
            DrugCreate(
                sku="INVALID-001",
                name="Invalid Drug",
                generic_name="invalid_drug",
                dosage="10mg",
                quantity=100,
                expiration_date="2020-01-01",
                manufacturer="Test Pharma",
                price=29.99,
                category="Antibiotic",
            ),
        ]

        with pytest.raises(HTTPException) as exc_info:
            self.service.batch_create_drugs(drugs_data)
        assert exc_info.value.status_code == 400
        assert "cannot be in the past" in str(exc_info.value.detail)

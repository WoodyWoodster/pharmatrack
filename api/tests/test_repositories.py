"""Tests for drug repository."""

import pytest
from app.repositories.drug_repository import DrugRepository
from app.repositories.drug_interface import DrugRepositoryInterface
from app.schemas.drug import DrugCreate, DrugUpdate


class TestDrugRepository:
    """Test cases for DrugRepository."""

    @pytest.fixture(autouse=True)
    def setup(self, db_session):
        """Set up repository for each test."""
        self.repository: DrugRepositoryInterface = DrugRepository(db_session)

    @pytest.fixture
    def sample_drug(self, sample_drug_create):
        """Create a sample drug in the repository."""
        return self.repository.create(sample_drug_create)

    def test_repository_implements_interface(self):
        """Test that DrugRepository implements DrugRepositoryInterface."""
        assert isinstance(self.repository, DrugRepositoryInterface)

    def test_create_drug(self, sample_drug_create):
        """Test creating a drug."""
        drug = self.repository.create(sample_drug_create)

        assert drug.id is not None
        assert drug.sku == sample_drug_create.sku
        assert drug.name == sample_drug_create.name

    def test_get_drug_by_id(self, sample_drug):
        """Test retrieving a drug by ID."""
        retrieved_drug = self.repository.get_by_id(sample_drug.id)

        assert retrieved_drug is not None
        assert retrieved_drug.id == sample_drug.id
        assert retrieved_drug.name == sample_drug.name

    def test_get_drug_by_id_not_found(self):
        """Test retrieving a non-existent drug."""
        drug = self.repository.get_by_id(999)
        assert drug is None

    def test_get_drug_by_sku(self, sample_drug):
        """Test retrieving a drug by SKU."""
        retrieved_drug = self.repository.get_by_sku(sample_drug.sku)

        assert retrieved_drug is not None
        assert retrieved_drug.sku == sample_drug.sku

    def test_get_drug_by_sku_not_found(self):
        """Test retrieving a drug by non-existent SKU."""
        drug = self.repository.get_by_sku("NON-EXISTENT")
        assert drug is None

    def test_get_all_drugs(self, sample_drug):
        """Test retrieving all drugs."""
        drug_data_2 = DrugCreate(
            sku="TEST-002",
            name="Another Test Drug",
            generic_name="another_test",
            dosage="20mg",
            quantity=50,
            expiration_date="2025-06-30",
            manufacturer="Another Pharma",
            price=15.99,
            category="Vitamins",
        )
        self.repository.create(drug_data_2)

        drugs = self.repository.get_all()
        assert len(drugs) == 2

    def test_update_drug(self, sample_drug):
        """Test updating a drug."""
        update_data = DrugUpdate(
            name="Updated Test Medication", quantity=150, price=35.99
        )

        updated_drug = self.repository.update(sample_drug.id, update_data)

        assert updated_drug is not None
        assert updated_drug.name == "Updated Test Medication"
        assert updated_drug.quantity == 150
        assert updated_drug.price == 35.99
        assert updated_drug.sku == sample_drug.sku

    def test_update_drug_not_found(self):
        """Test updating a non-existent drug."""
        update_data = DrugUpdate(name="Won't work")
        updated_drug = self.repository.update(999, update_data)
        assert updated_drug is None

    def test_delete_drug(self, sample_drug):
        """Test deleting a drug."""
        success = self.repository.delete(sample_drug.id)
        assert success is True

        deleted_drug = self.repository.get_by_id(sample_drug.id)
        assert deleted_drug is None

    def test_delete_drug_not_found(self):
        """Test deleting a non-existent drug."""
        success = self.repository.delete(999)
        assert success is False

    def test_search_by_name(self, sample_drug):
        """Test searching drugs by name."""
        drug_data_2 = DrugCreate(
            sku="TEST-002",
            name="Pain Reliever",
            generic_name="pain_reliever",
            dosage="500mg",
            quantity=75,
            expiration_date="2025-08-15",
            manufacturer="Pain Corp",
            price=12.50,
            category="Pain Relief",
        )
        self.repository.create(drug_data_2)

        results = self.repository.search("Test")
        assert len(results) == 1
        assert results[0].name == sample_drug.name

        results = self.repository.search("Pain")
        assert len(results) == 1
        assert results[0].name == "Pain Reliever"

    def test_filter_by_category(self, sample_drug):
        """Test filtering drugs by category."""
        vitamin_data = DrugCreate(
            sku="VIT-001",
            name="Vitamin C",
            generic_name="ascorbic_acid",
            dosage="1000mg",
            quantity=200,
            expiration_date="2025-12-31",
            manufacturer="Vitamin Corp",
            price=8.99,
            category="Vitamins",
        )
        self.repository.create(vitamin_data)

        pain_drugs = self.repository.filter_by_category("Pain Relief")
        assert len(pain_drugs) == 1
        assert pain_drugs[0].category == "Pain Relief"

        vitamin_drugs = self.repository.filter_by_category("Vitamins")
        assert len(vitamin_drugs) == 1
        assert vitamin_drugs[0].category == "Vitamins"

    def test_search_with_combined_filters(self, sample_drug):
        """Test searching with both name and category filters."""
        drugs_data = [
            DrugCreate(
                sku="PAIN-001",
                name="Test Pain Killer",
                generic_name="test_pain_killer",
                dosage="200mg",
                quantity=50,
                expiration_date="2025-06-30",
                manufacturer="Test Pharma",
                price=15.99,
                category="Pain Relief",
            ),
            DrugCreate(
                sku="VIT-002",
                name="Test Vitamin",
                generic_name="test_vitamin",
                dosage="500mg",
                quantity=100,
                expiration_date="2025-12-31",
                manufacturer="Test Pharma",
                price=10.99,
                category="Vitamins",
            ),
        ]

        for drug_data in drugs_data:
            self.repository.create(drug_data)

        results = self.repository.search("Test")
        assert len(results) == 3

    def test_search_no_results(self):
        """Test search with no matching results."""
        results = self.repository.search("NonExistent")
        assert len(results) == 0

    def test_exists_method(self, sample_drug):
        """Test that exists method correctly identifies existing drugs."""
        assert self.repository.exists(sample_drug.sku) is True
        assert self.repository.exists("NON-EXISTENT") is False

    def test_batch_create_drugs(self):
        """Test batch creation of multiple drugs."""
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

        created_drugs = self.repository.batch_create(drugs_data)

        assert len(created_drugs) == 2
        assert created_drugs[0].sku == "BATCH-001"
        assert created_drugs[1].sku == "BATCH-002"
        assert all(drug.id is not None for drug in created_drugs)

        all_drugs = self.repository.get_all()
        assert len(all_drugs) == 2

    def test_batch_create_empty_list(self):
        """Test batch creation with empty list."""
        result = self.repository.batch_create([])
        assert result == []

    def test_check_existing_skus(self, sample_drug):
        """Test batch SKU existence checking."""
        drug_data_2 = DrugCreate(
            sku="TEST-002",
            name="Another Test Drug",
            generic_name="another_test",
            dosage="20mg",
            quantity=50,
            expiration_date="2025-06-30",
            manufacturer="Another Pharma",
            price=15.99,
            category="Vitamins",
        )
        self.repository.create(drug_data_2)

        skus_to_check = ["TEST-001", "TEST-002", "NON-EXISTENT", "ALSO-MISSING"]
        existing_skus = self.repository.check_existing_skus(skus_to_check)

        assert len(existing_skus) == 2
        assert "TEST-001" in existing_skus
        assert "TEST-002" in existing_skus
        assert "NON-EXISTENT" not in existing_skus
        assert "ALSO-MISSING" not in existing_skus

    def test_check_existing_skus_empty_list(self):
        """Test checking existing SKUs with empty list."""
        result = self.repository.check_existing_skus([])
        assert result == []

    def test_get_paginated(self, sample_drug):
        """Test paginated drug retrieval."""
        for i in range(2, 6):
            drug_data = DrugCreate(
                sku=f"TEST-{i:03d}",
                name=f"Test Drug {i}",
                generic_name=f"test_drug_{i}",
                dosage="10mg",
                quantity=100,
                expiration_date="2025-12-31",
                manufacturer="Test Pharma",
                price=29.99,
                category="Test Category",
            )
            self.repository.create(drug_data)

        drugs, total = self.repository.get_paginated(page=1, page_size=3)
        assert len(drugs) == 3
        assert total == 5

        drugs, total = self.repository.get_paginated(page=2, page_size=3)
        assert len(drugs) == 2
        assert total == 5

    def test_search_paginated(self, sample_drug):
        """Test paginated search."""
        for i in range(2, 6):
            drug_data = DrugCreate(
                sku=f"TEST-{i:03d}",
                name=f"Test Drug {i}",
                generic_name=f"test_drug_{i}",
                dosage="10mg",
                quantity=100,
                expiration_date="2025-12-31",
                manufacturer="Test Pharma",
                price=29.99,
                category="Test Category",
            )
            self.repository.create(drug_data)

        other_drug = DrugCreate(
            sku="OTHER-001",
            name="Other Drug",
            generic_name="other_drug",
            dosage="10mg",
            quantity=100,
            expiration_date="2025-12-31",
            manufacturer="Other Pharma",
            price=29.99,
            category="Other Category",
        )
        self.repository.create(other_drug)

        drugs, total = self.repository.search_paginated("Test", page=1, page_size=3)
        assert len(drugs) == 3
        assert total == 5

        drugs, total = self.repository.search_paginated("Test", page=2, page_size=3)
        assert len(drugs) == 2
        assert total == 5

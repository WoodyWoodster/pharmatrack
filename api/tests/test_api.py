"""Tests for FastAPI drug endpoints."""


class TestDrugAPI:
    """Test cases for drug API endpoints."""

    def test_create_drug_success(self, client, sample_drug_data):
        """Test successful drug creation via API."""
        response = client.post("/api/v1/drugs/", json=sample_drug_data)

        assert response.status_code == 201
        data = response.json()
        assert data["id"] is not None

    def test_create_drug_invalid_data(self, client):
        """Test drug creation with invalid data."""
        invalid_data = {
            "sku": "TEST-001",
            "name": "",
            "generic_name": "test",
            "dosage": "10mg",
            "quantity": -5,
            "expiration_date": "invalid-date",
            "manufacturer": "Test Pharma",
            "price": -10.0,
            "category": "Pain Relief",
        }

        response = client.post("/api/v1/drugs/", json=invalid_data)
        assert response.status_code == 422

    def test_create_drug_duplicate_sku(self, client, sample_drug_data):
        """Test creating drug with duplicate SKU."""
        client.post("/api/v1/drugs/", json=sample_drug_data)

        response = client.post("/api/v1/drugs/", json=sample_drug_data)
        assert response.status_code == 400
        assert "already exists" in response.json()["detail"]

    def test_get_all_drugs(self, client, sample_drug_data):
        """Test retrieving all drugs."""
        client.post("/api/v1/drugs/", json=sample_drug_data)

        response = client.get("/api/v1/drugs/")
        assert response.status_code == 200

        data = response.json()
        assert len(data) == 1

    def test_get_drug_by_id(self, client, sample_drug_data):
        """Test retrieving a drug by ID."""
        create_response = client.post("/api/v1/drugs/", json=sample_drug_data)
        drug_id = create_response.json()["id"]

        response = client.get(f"/api/v1/drugs/{drug_id}")
        assert response.status_code == 200

        data = response.json()
        assert data["id"] == drug_id

    def test_get_drug_by_id_not_found(self, client):
        """Test retrieving a non-existent drug."""
        response = client.get("/api/v1/drugs/999")
        assert response.status_code == 404
        assert "not found" in response.json()["detail"]

    def test_update_drug_success(self, client, sample_drug_data):
        """Test successful drug update."""
        create_response = client.post("/api/v1/drugs/", json=sample_drug_data)
        drug_id = create_response.json()["id"]

        update_data = {"name": "Updated Medicine", "price": 45.99, "quantity": 200}

        response = client.put(f"/api/v1/drugs/{drug_id}", json=update_data)
        assert response.status_code == 200

        data = response.json()
        assert data["name"] == "Updated Medicine"
        assert data["price"] == 45.99
        assert data["quantity"] == 200

    def test_update_drug_not_found(self, client):
        """Test updating a non-existent drug."""
        update_data = {"name": "Won't work"}

        response = client.put("/api/v1/drugs/999", json=update_data)
        assert response.status_code == 404
        assert "not found" in response.json()["detail"]

    def test_update_drug_invalid_data(self, client, sample_drug_data):
        """Test updating drug with invalid data."""
        create_response = client.post("/api/v1/drugs/", json=sample_drug_data)
        drug_id = create_response.json()["id"]

        invalid_update = {"price": -10.0}

        response = client.put(f"/api/v1/drugs/{drug_id}", json=invalid_update)
        assert response.status_code == 422

    def test_delete_drug_success(self, client, sample_drug_data):
        """Test successful drug deletion."""
        create_response = client.post("/api/v1/drugs/", json=sample_drug_data)
        drug_id = create_response.json()["id"]

        response = client.delete(f"/api/v1/drugs/{drug_id}")
        assert response.status_code == 200

        get_response = client.get(f"/api/v1/drugs/{drug_id}")
        assert get_response.status_code == 404

    def test_delete_drug_not_found(self, client):
        """Test deleting a non-existent drug."""
        response = client.delete("/api/v1/drugs/999")
        assert response.status_code == 404
        assert "not found" in response.json()["detail"]

    def test_search_drugs_by_name(self, client):
        """Test searching drugs by name."""
        drugs_data = [
            {
                "sku": "TEST-001",
                "name": "Test Medicine",
                "generic_name": "test_medicine",
                "dosage": "10mg",
                "quantity": 100,
                "expiration_date": "2025-12-31",
                "manufacturer": "Test Pharma",
                "price": 29.99,
                "category": "Pain Relief",
            },
            {
                "sku": "PAIN-001",
                "name": "Pain Reliever",
                "generic_name": "pain_reliever",
                "dosage": "500mg",
                "quantity": 50,
                "expiration_date": "2025-06-30",
                "manufacturer": "Pain Corp",
                "price": 15.99,
                "category": "Pain Relief",
            },
        ]

        for drug_data in drugs_data:
            client.post("/api/v1/drugs/", json=drug_data)

        response = client.get("/api/v1/drugs/", params={"search": "Test"})
        assert response.status_code == 200

        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == "Test Medicine"

    def test_search_drugs_by_category(self, client):
        """Test filtering drugs by category."""
        drugs_data = [
            {
                "sku": "PAIN-001",
                "name": "Pain Medication",
                "generic_name": "pain_med",
                "dosage": "10mg",
                "quantity": 100,
                "expiration_date": "2025-12-31",
                "manufacturer": "Pain Corp",
                "price": 29.99,
                "category": "Pain Relief",
            },
            {
                "sku": "VIT-001",
                "name": "Vitamin C",
                "generic_name": "ascorbic_acid",
                "dosage": "1000mg",
                "quantity": 200,
                "expiration_date": "2025-12-31",
                "manufacturer": "Vitamin Corp",
                "price": 12.99,
                "category": "Vitamins",
            },
        ]

        for drug_data in drugs_data:
            client.post("/api/v1/drugs/", json=drug_data)

        response = client.get("/api/v1/drugs/", params={"category": "Pain Relief"})
        assert response.status_code == 200

        data = response.json()
        assert len(data) == 1
        assert data[0]["category"] == "Pain Relief"

    def test_search_drugs_combined_filters(self, client):
        """Test searching with both name and category filters."""
        drugs_data = [
            {
                "sku": "TEST-PAIN",
                "name": "Test Pain Killer",
                "generic_name": "test_pain_killer",
                "dosage": "200mg",
                "quantity": 50,
                "expiration_date": "2025-06-30",
                "manufacturer": "Test Pharma",
                "price": 25.99,
                "category": "Pain Relief",
            },
            {
                "sku": "TEST-VIT",
                "name": "Test Vitamin",
                "generic_name": "test_vitamin",
                "dosage": "500mg",
                "quantity": 100,
                "expiration_date": "2025-12-31",
                "manufacturer": "Test Pharma",
                "price": 15.99,
                "category": "Vitamins",
            },
            {
                "sku": "OTHER-PAIN",
                "name": "Other Pain Med",
                "generic_name": "other_pain_med",
                "dosage": "100mg",
                "quantity": 75,
                "expiration_date": "2025-09-30",
                "manufacturer": "Other Pharma",
                "price": 20.99,
                "category": "Pain Relief",
            },
        ]

        for drug_data in drugs_data:
            client.post("/api/v1/drugs/", json=drug_data)

        response = client.get(
            "/api/v1/drugs/", params={"search": "Test", "category": "Pain Relief"}
        )
        assert response.status_code == 200

        data = response.json()
        assert len(data) == 1
        assert data[0]["name"] == "Test Pain Killer"

    def test_api_validation_error_format(self, client):
        """Test that validation errors are properly formatted."""
        invalid_data = {
            "sku": "",
            "name": "",
            "price": "not-a-number",
        }

        response = client.post("/api/v1/drugs/", json=invalid_data)
        assert response.status_code == 422

        error_data = response.json()
        assert "detail" in error_data
        assert isinstance(error_data["detail"], list)

    def test_empty_search_returns_all(self, client, sample_drug_data):
        """Test that empty search parameters return all drugs."""
        client.post("/api/v1/drugs/", json=sample_drug_data)

        response = client.get("/api/v1/drugs/", params={"search": "", "category": ""})
        assert response.status_code == 200

        data = response.json()
        assert len(data) == 1

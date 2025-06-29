# PharmaTrack API Tests

This directory contains comprehensive unit and integration tests for the PharmaTrack API backend.

## Test Structure

### Test Files

- `conftest.py` - Pytest configuration and shared fixtures
- `test_repositories.py` - Unit tests for the repository layer
- `test_services.py` - Unit tests for the service layer
- `test_api.py` - Integration tests for FastAPI endpoints

## Running Tests

### Prerequisites

```bash
# Install test dependencies
uv sync --group dev
```

### Run All Tests

```bash
pytest tests/
```

### Run with Verbose Output

```bash
pytest tests/ -v
```

### Run with Coverage Report

```bash
pytest tests/ --cov=app --cov-report=html
```

### Run Specific Test Files

```bash
# Repository tests only
pytest tests/test_repositories.py

# Service tests only
pytest tests/test_services.py

# API tests only
pytest tests/test_api.py
```

### Run Specific Test Methods

```bash
pytest tests/test_services.py::TestDrugService::test_create_drug_success
```

from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_database_session
from app.services.drug_service import DrugService
from app.schemas.drug import DrugCreate, DrugUpdate, DrugResponse

router = APIRouter()


def get_drug_service(db: Session = Depends(get_database_session)) -> DrugService:
    """Dependency to get drug service"""
    return DrugService(db)


@router.get("/", response_model=List[DrugResponse])
async def get_drugs(
    search: Optional[str] = Query(
        None, description="Search drugs by name, generic name, or manufacturer"
    ),
    category: Optional[str] = Query(None, description="Filter by category"),
    drug_service: DrugService = Depends(get_drug_service),
):
    """Get all drugs with optional search and category filtering"""
    if search or category:
        return drug_service.search_drugs(search or "", category)
    return drug_service.get_all_drugs()


@router.get("/categories", response_model=List[str])
async def get_categories(drug_service: DrugService = Depends(get_drug_service)):
    """Get all available drug categories"""
    return drug_service.get_categories()


@router.get("/low-stock", response_model=List[DrugResponse])
async def get_low_stock_drugs(
    threshold: int = Query(100, description="Stock threshold"),
    drug_service: DrugService = Depends(get_drug_service),
):
    """Get drugs with low stock"""
    return drug_service.get_low_stock_drugs(threshold)


@router.get("/expiring-soon", response_model=List[DrugResponse])
async def get_expiring_soon_drugs(
    days: int = Query(90, description="Days until expiration"),
    drug_service: DrugService = Depends(get_drug_service),
):
    """Get drugs expiring within specified days"""
    return drug_service.get_expiring_soon_drugs(days)


@router.get("/{drug_id}", response_model=DrugResponse)
async def get_drug(drug_id: int, drug_service: DrugService = Depends(get_drug_service)):
    """Get a specific drug by ID"""
    return drug_service.get_drug_by_id(drug_id)


@router.post("/", response_model=DrugResponse, status_code=201)
async def create_drug(
    drug_data: DrugCreate, drug_service: DrugService = Depends(get_drug_service)
):
    """Create a new drug"""
    return drug_service.create_drug(drug_data)


@router.post("/batch", response_model=List[DrugResponse], status_code=201)
async def batch_create_drugs(
    drugs_data: List[DrugCreate], drug_service: DrugService = Depends(get_drug_service)
):
    """Create multiple drugs in a batch"""
    return drug_service.batch_create_drugs(drugs_data)


@router.put("/{drug_id}", response_model=DrugResponse)
async def update_drug(
    drug_id: int,
    drug_data: DrugUpdate,
    drug_service: DrugService = Depends(get_drug_service),
):
    """Update an existing drug"""
    return drug_service.update_drug(drug_id, drug_data)


@router.delete("/{drug_id}")
async def delete_drug(
    drug_id: int, drug_service: DrugService = Depends(get_drug_service)
):
    """Delete a drug"""
    return drug_service.delete_drug(drug_id)

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class DrugBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    generic_name: str = Field(..., min_length=1, max_length=100)
    dosage: str = Field(..., min_length=1, max_length=50)
    quantity: int = Field(..., ge=0)
    expiration_date: str = Field(..., pattern=r"^\d{4}-\d{2}-\d{2}$")
    manufacturer: str = Field(..., min_length=1, max_length=100)
    price: float = Field(..., gt=0)
    category: str = Field(..., min_length=1, max_length=50)
    description: Optional[str] = Field(None, max_length=500)


class DrugCreate(DrugBase):
    pass


class DrugUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    generic_name: Optional[str] = Field(None, min_length=1, max_length=100)
    dosage: Optional[str] = Field(None, min_length=1, max_length=50)
    quantity: Optional[int] = Field(None, ge=0)
    expiration_date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    manufacturer: Optional[str] = Field(None, min_length=1, max_length=100)
    price: Optional[float] = Field(None, gt=0)
    category: Optional[str] = Field(None, min_length=1, max_length=50)
    description: Optional[str] = Field(None, max_length=500)


class DrugResponse(DrugBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

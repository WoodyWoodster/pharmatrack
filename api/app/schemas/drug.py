from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime


class DrugBase(BaseModel):
    name: str = Field(
        ..., min_length=1, max_length=100, description="Drug Name is required"
    )
    sku: str = Field(..., min_length=1, max_length=100, description="SKU is required")
    generic_name: str = Field(
        ..., min_length=1, max_length=100, description="Generic Name is required"
    )
    dosage: str = Field(
        ..., min_length=1, max_length=50, description="Dosage is required"
    )
    quantity: int = Field(..., ge=1, description="Quantity must be at least 1")
    expiration_date: str = Field(
        ...,
        pattern=r"^\d{4}-\d{2}-\d{2}$",
        description="Please select a valid expiration date",
    )
    manufacturer: str = Field(
        ..., min_length=1, max_length=100, description="Manufacturer is required"
    )
    price: float = Field(..., gt=0, description="Price must be greater than $0.00")
    category: str = Field(
        ..., min_length=1, max_length=50, description="Category is required"
    )
    description: Optional[str] = Field(None, max_length=500)

    @field_validator("name")
    def validate_name(cls, v):
        if not v or not v.strip():
            raise ValueError("Drug Name is required")
        return v.strip()

    @field_validator("sku")
    def validate_sku(cls, v):
        if not v or not v.strip():
            raise ValueError("SKU is required")
        return v.strip()

    @field_validator("generic_name")
    def validate_generic_name(cls, v):
        if not v or not v.strip():
            raise ValueError("Generic Name is required")
        return v.strip()

    @field_validator("dosage")
    def validate_dosage(cls, v):
        if not v or not v.strip():
            raise ValueError("Dosage is required")
        return v.strip()

    @field_validator("manufacturer")
    def validate_manufacturer(cls, v):
        if not v or not v.strip():
            raise ValueError("Manufacturer is required")
        return v.strip()

    @field_validator("category")
    def validate_category(cls, v):
        if not v or not v.strip():
            raise ValueError("Category is required")
        return v.strip()

    @field_validator("quantity")
    def validate_quantity(cls, v):
        if v < 1:
            raise ValueError("Quantity must be at least 1")
        return v

    @field_validator("price")
    def validate_price(cls, v):
        if v <= 0:
            raise ValueError("Price must be greater than $0.00")
        return v


class DrugCreate(DrugBase):
    pass


class DrugUpdate(BaseModel):
    sku: Optional[str] = Field(None, max_length=100)
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    generic_name: Optional[str] = Field(None, min_length=1, max_length=100)
    dosage: Optional[str] = Field(None, min_length=1, max_length=50)
    quantity: Optional[int] = Field(None, ge=1)
    expiration_date: Optional[str] = Field(None, pattern=r"^\d{4}-\d{2}-\d{2}$")
    manufacturer: Optional[str] = Field(None, min_length=1, max_length=100)
    price: Optional[float] = Field(None, gt=0)
    category: Optional[str] = Field(None, min_length=1, max_length=50)
    description: Optional[str] = Field(None, max_length=500)

    @field_validator("name")
    def validate_name(cls, v):
        if v is not None and (not v or not v.strip()):
            raise ValueError("Drug Name is required")
        return v.strip() if v else v

    @field_validator("sku")
    def validate_sku(cls, v):
        if v is not None and (not v or not v.strip()):
            raise ValueError("SKU is required")
        return v.strip() if v else v

    @field_validator("generic_name")
    def validate_generic_name(cls, v):
        if v is not None and (not v or not v.strip()):
            raise ValueError("Generic Name is required")
        return v.strip() if v else v

    @field_validator("dosage")
    def validate_dosage(cls, v):
        if v is not None and (not v or not v.strip()):
            raise ValueError("Dosage is required")
        return v.strip() if v else v

    @field_validator("manufacturer")
    def validate_manufacturer(cls, v):
        if v is not None and (not v or not v.strip()):
            raise ValueError("Manufacturer is required")
        return v.strip() if v else v

    @field_validator("category")
    def validate_category(cls, v):
        if v is not None and (not v or not v.strip()):
            raise ValueError("Category is required")
        return v.strip() if v else v

    @field_validator("quantity")
    def validate_quantity(cls, v):
        if v is not None and v < 1:
            raise ValueError("Quantity must be at least 1")
        return v

    @field_validator("price")
    def validate_price(cls, v):
        if v is not None and v <= 0:
            raise ValueError("Price must be greater than $0.00")
        return v


class DrugResponse(DrugBase):
    id: int
    sku: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

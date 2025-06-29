"""
Custom exception handlers for the PharmaTrack API.
"""

from fastapi import Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Custom validation error handler to return user-friendly messages"""
    errors = []

    for error in exc.errors():
        field_path = error.get("loc", [])
        field_name = field_path[-1] if field_path else "unknown"

        error_msg = error.get("msg", "Invalid value")
        error_type = error.get("type", "")

        if error_type == "value_error":
            errors.append(error_msg)
        else:
            if field_name == "name":
                errors.append("Drug Name is required")
            elif field_name == "generic_name":
                errors.append("Generic Name is required")
            elif field_name == "sku":
                errors.append("SKU is required")
            elif field_name == "dosage":
                errors.append("Dosage is required")
            elif field_name == "quantity":
                if "greater than" in error_msg:
                    errors.append("Quantity must be at least 1")
                elif "integer" in error_msg:
                    errors.append("Quantity must be a whole number")
                else:
                    errors.append("Quantity is required")
            elif field_name == "expiration_date":
                if "pattern" in error_msg:
                    errors.append("Please select a valid expiration date")
                else:
                    errors.append("Expiration Date is required")
            elif field_name == "manufacturer":
                errors.append("Manufacturer is required")
            elif field_name == "price":
                if "greater than" in error_msg:
                    errors.append("Price must be greater than $0.00")
                elif "float" in error_msg:
                    errors.append("Price must be a valid number")
                else:
                    errors.append("Price is required")
            elif field_name == "category":
                errors.append("Category is required")
            else:
                errors.append(f"{field_name} is invalid")

    return JSONResponse(status_code=422, content={"detail": errors})

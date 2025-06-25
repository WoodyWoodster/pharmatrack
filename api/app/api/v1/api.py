from fastapi import APIRouter
from app.api.v1.endpoints import drugs

api_router = APIRouter()

api_router.include_router(drugs.router, prefix="/drugs", tags=["drugs"])

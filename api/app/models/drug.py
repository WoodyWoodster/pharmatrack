from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.database import Base


class Drug(Base):
    __tablename__ = "drugs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False, index=True)
    generic_name = Column(String(100), nullable=False)
    dosage = Column(String(50), nullable=False)
    quantity = Column(Integer, nullable=False)
    expiration_date = Column(String(10), nullable=False)
    manufacturer = Column(String(100), nullable=False)
    price = Column(Float, nullable=False)
    category = Column(String(50), nullable=False)
    description = Column(String(500))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def __repr__(self):
        return f"<Drug(id={self.id}, name='{self.name}', quantity={self.quantity})>"

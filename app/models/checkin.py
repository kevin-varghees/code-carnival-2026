from sqlalchemy import Column, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship

from app.database import Base, utcnow


class Checkin(Base):
    """Audit log of check-ins. The unique registration_id makes check-in idempotent:
    a registration can only ever be checked in once, even under concurrent scans."""

    __tablename__ = "checkins"

    id = Column(Integer, primary_key=True, index=True)
    registration_id = Column(
        Integer,
        ForeignKey("registrations.id"),
        nullable=False,
        unique=True,
        index=True,
    )
    checked_in_at = Column(DateTime, nullable=False, default=utcnow)

    registration = relationship("Registration", back_populates="checkin")

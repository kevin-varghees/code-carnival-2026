from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database import Base, utcnow


class Registration(Base):
    __tablename__ = "registrations"
    __table_args__ = (
        UniqueConstraint("user_id", "event_id", name="uq_registration_user_event"),
    )

    id = Column(Integer, primary_key=True, index=True)
    registration_code = Column(String(64), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False, index=True)
    created_at = Column(DateTime, nullable=False, default=utcnow)

    user = relationship("User", back_populates="registrations")
    event = relationship("Event", back_populates="registrations")
    checkin = relationship(
        "Checkin",
        back_populates="registration",
        uselist=False,
        cascade="all, delete-orphan",
    )
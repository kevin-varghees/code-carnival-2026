from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    event_code = Column(String(12), unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    date_time = Column(DateTime, nullable=False, index=True)
    location = Column(String(255), nullable=False)
    capacity = Column(Integer, nullable=False)
    organizer_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    organizer = relationship("User", back_populates="events")
    registrations = relationship(
        "Registration", back_populates="event", cascade="all, delete-orphan"
    )

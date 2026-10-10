from sqlalchemy import Column, DateTime, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base, utcnow


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="attendee")  # attendee | organizer
    created_at = Column(DateTime, nullable=False, default=utcnow)
    
    # Social links & avatar
    linkedin = Column(String, nullable=True)
    github = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)

    # Academic & Profile additions for frontend integration
    graduation_status = Column(String(50), nullable=True)  # e.g., "Undergraduate", "Alumni"
    university = Column(String(200), nullable=True)
    course = Column(String(200), nullable=True)
    interests = Column(Text, nullable=True)  # Comma-separated or JSON string of tags

    events = relationship("Event", back_populates="organizer")
    registrations = relationship(
        "Registration", back_populates="user", cascade="all, delete-orphan"
    )
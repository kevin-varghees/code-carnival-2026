from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.schemas.auth import UTCDatetime


class EventCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    date_time: datetime
    location: str = Field(min_length=1, max_length=255)
    capacity: int = Field(gt=0, le=100000)

    @field_validator("date_time")
    @classmethod
    def normalize_to_naive_utc(cls, value: datetime) -> datetime:
        if value.tzinfo is not None:
            value = value.astimezone(timezone.utc).replace(tzinfo=None)
        return value


class EventUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    description: Optional[str] = None
    date_time: Optional[datetime] = None
    location: Optional[str] = Field(default=None, min_length=1, max_length=255)
    capacity: Optional[int] = Field(default=None, gt=0, le=100000)

    @field_validator("date_time")
    @classmethod
    def normalize_to_naive_utc(cls, value: Optional[datetime]) -> Optional[datetime]:
        if value is not None and value.tzinfo is not None:
            value = value.astimezone(timezone.utc).replace(tzinfo=None)
        return value


class EventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    event_code: str
    title: str
    description: Optional[str] = None
    date_time: UTCDatetime
    location: str
    capacity: int
    organizer_id: int
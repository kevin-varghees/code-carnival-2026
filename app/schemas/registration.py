from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.schemas.auth import UTCDatetime
from app.schemas.event import EventOut


class RegistrationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    registration_code: str
    user_id: int
    event_id: int
    created_at: UTCDatetime


class TicketOut(BaseModel):
    registration_id: int
    registration_code: str
    qr_data: str  # string to encode into the QR image on the frontend
    registered_at: UTCDatetime
    checked_in: bool
    checked_in_at: Optional[UTCDatetime] = None
    event: EventOut


class AttendeeOut(BaseModel):
    registration_id: int
    registration_code: str
    name: str
    email: str
    registered_at: UTCDatetime
    checked_in: bool
    checked_in_at: Optional[UTCDatetime] = None

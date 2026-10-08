from typing import List
from pydantic import BaseModel, Field

from app.schemas.auth import UTCDatetime


class CheckinRequest(BaseModel):
    event_id: int
    registration_code: str = Field(min_length=1, max_length=256)


class CheckinResponse(BaseModel):
    status: str  # "success"
    message: str
    registration_id: int
    event_id: int
    attendee_name: str
    checked_in_at: UTCDatetime


class RecentAttendeeActivity(BaseModel):
    checkin_id: int
    registration_id: int
    checked_in_at: UTCDatetime


class EventStatsOut(BaseModel):
    event_id: int
    event_title: str
    total_capacity: int
    registered_count: int
    checked_in_count: int
    remaining_seats: int
    attendance_rate_pct: float
    occupancy_rate_pct: float
    recent_checkins: List[RecentAttendeeActivity] = []
from datetime import datetime
from typing import Annotated, Literal, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, PlainSerializer


def _serialize_utc(value: datetime) -> str:
    if value.tzinfo is None:
        return value.isoformat() + "Z"
    return value.isoformat()


UTCDatetime = Annotated[datetime, PlainSerializer(_serialize_utc, return_type=str)]


class PeerUserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    name: str
    email: EmailStr
    avatar_url: Optional[str] = None
    graduation_status: Optional[str] = Field(default=None, alias="graduationStatus")
    university: Optional[str] = None
    course: Optional[str] = None
    interests: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    connection_status: Optional[str] = "none"  # "none", "pending_sent", "pending_received", "accepted"


class FriendRequestCreate(BaseModel):
    receiver_id: int


class FriendResponseAction(BaseModel):
    action: Literal["accept", "reject"]


class FriendshipOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    sender_id: int
    receiver_id: int
    status: str
    created_at: UTCDatetime
    sender: PeerUserOut
    receiver: PeerUserOut
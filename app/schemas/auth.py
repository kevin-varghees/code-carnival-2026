from datetime import datetime
from typing import Annotated, Literal, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, PlainSerializer


def _serialize_utc(value: datetime) -> str:
    """Stored datetimes are naive UTC; emit them with a 'Z' so JS parses them correctly."""
    if value.tzinfo is None:
        return value.isoformat() + "Z"
    return value.isoformat()


# Shared by every schema that returns datetimes
UTCDatetime = Annotated[datetime, PlainSerializer(_serialize_utc, return_type=str)]


class UserCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)
    role: Literal["attendee", "organizer"] = "attendee"

    # Academic fields from Signup.jsx
    graduation_status: Optional[str] = Field(default=None, alias="graduationStatus")
    university: Optional[str] = None
    course: Optional[str] = None
    interests: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=72)


class UserUpdateSchema(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    name: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    avatar_url: Optional[str] = None
    graduation_status: Optional[str] = Field(default=None, alias="graduationStatus")
    university: Optional[str] = None
    course: Optional[str] = None
    interests: Optional[str] = None


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: int
    name: str
    email: EmailStr
    role: str
    linkedin: Optional[str] = None
    github: Optional[str] = None
    avatar_url: Optional[str] = None
    graduation_status: Optional[str] = Field(default=None, alias="graduationStatus")
    university: Optional[str] = None
    course: Optional[str] = None
    interests: Optional[str] = None
    created_at: UTCDatetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class TokenData(BaseModel):
    user_id: Optional[int] = None
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.database import get_db, utcnow
from app.dependencies import get_current_user, verify_event_owner
from app.models import Event, Registration, User
from app.schemas.event import EventCreate, EventOut, EventUpdate
from app.schemas.registration import AttendeeOut
from app.services.qr_service import generate_event_code

router = APIRouter(prefix="/events", tags=["Events"])


@router.get("", response_model=List[EventOut])
def list_upcoming_events(db: Session = Depends(get_db)):
    """Public: upcoming events, soonest first."""
    return (
        db.query(Event)
        .filter(Event.date_time >= utcnow())
        .order_by(Event.date_time.asc())
        .all()
    )


@router.post("", response_model=EventOut, status_code=status.HTTP_201_CREATED)
def create_event(
    payload: EventCreate,
    db: Session = Depends(get_db),
    organizer: User = Depends(get_current_user),
):
    last_error = None
    for _ in range(10):  # retry in the unlikely event of an event_code collision
        event = Event(
            event_code=generate_event_code(),
            title=payload.title.strip(),
            description=payload.description,
            date_time=payload.date_time,
            location=payload.location.strip(),
            capacity=payload.capacity,
            organizer_id=organizer.id,
        )
        db.add(event)
        try:
            db.commit()
            db.refresh(event)
            return event
        except IntegrityError as exc:
            db.rollback()
            last_error = exc

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail=f"Could not generate a unique event code: {last_error}",
    )


# NOTE: static paths such as /mine must be declared before /{event_id}
@router.get("/mine", response_model=List[EventOut])
def list_my_events(
    db: Session = Depends(get_db),
    organizer: User = Depends(get_current_user),
):
    """User: all events created by the current user."""
    return (
        db.query(Event)
        .filter(Event.organizer_id == organizer.id)
        .order_by(Event.date_time.desc())
        .all()
    )


@router.get("/{event_id}", response_model=EventOut)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
        )
    return event


@router.put("/{event_id}", response_model=EventOut)
def update_event(
    payload: EventUpdate,
    event: Event = Depends(verify_event_owner),
    db: Session = Depends(get_db),
):
    """Organizer only: update event details."""
    if payload.title is not None:
        event.title = payload.title.strip()
    if payload.description is not None:
        event.description = payload.description
    if payload.date_time is not None:
        event.date_time = payload.date_time
    if payload.location is not None:
        event.location = payload.location.strip()
    if payload.capacity is not None:
        event.capacity = payload.capacity

    db.commit()
    db.refresh(event)
    return event


@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(
    event: Event = Depends(verify_event_owner),
    db: Session = Depends(get_db),
):
    """Organizer only: delete event and associated data."""
    db.delete(event)
    db.commit()
    return None


@router.get("/{event_id}/registrations", response_model=List[AttendeeOut])
def list_event_registrations(
    event: Event = Depends(verify_event_owner),
    db: Session = Depends(get_db),
):
    """Event Owner only: who has registered and who has checked in."""
    registrations = (
        db.query(Registration)
        .options(joinedload(Registration.user), joinedload(Registration.checkin))
        .filter(Registration.event_id == event.id)
        .order_by(Registration.created_at.asc())
        .all()
    )
    return [
        AttendeeOut(
            registration_id=r.id,
            registration_code=r.registration_code,
            name=r.user.name,
            email=r.user.email,
            registered_at=r.created_at,
            checked_in=r.checkin is not None,
            checked_in_at=r.checkin.checked_in_at if r.checkin else None,
        )
        for r in registrations
    ]
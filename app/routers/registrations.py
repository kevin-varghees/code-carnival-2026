from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.database import get_db, utcnow
from app.dependencies import get_current_user
from app.models import Event, Registration, User
from app.schemas.event import EventOut
from app.schemas.registration import TicketOut
from app.services.pdf_service import generate_ticket_pdf
from app.services.qr_service import generate_unique_registration_token

router = APIRouter(prefix="/registrations", tags=["Registrations"])


def _to_ticket(registration: Registration) -> TicketOut:
    checkin = registration.checkin
    return TicketOut(
        registration_id=registration.id,
        registration_code=registration.registration_code,
        qr_data=registration.registration_code,
        registered_at=registration.created_at,
        checked_in=checkin is not None,
        checked_in_at=checkin.checked_in_at if checkin else None,
        event=EventOut.model_validate(registration.event),
    )


@router.post(
    "/events/{event_id}",
    response_model=TicketOut,
    status_code=status.HTTP_201_CREATED,
)
def register_for_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "attendee":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only attendees can register for events",
        )

    # Lock the event row (no-op on SQLite) so concurrent registrations
    # cannot exceed capacity on databases like PostgreSQL.
    event = (
        db.query(Event).filter(Event.id == event_id).with_for_update().first()
    )
    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
        )

    if event.date_time < utcnow():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This event has already taken place",
        )

    already = (
        db.query(Registration)
        .filter(
            Registration.event_id == event_id,
            Registration.user_id == current_user.id,
        )
        .first()
    )
    if already is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You are already registered for this event",
        )

    registered_count = (
        db.query(func.count(Registration.id))
        .filter(Registration.event_id == event_id)
        .scalar()
        or 0
    )
    if registered_count >= event.capacity:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="This event is full",
        )

    registration = Registration(
        registration_code=generate_unique_registration_token(),
        user_id=current_user.id,
        event_id=event_id,
    )
    db.add(registration)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You are already registered for this event",
        )
    db.refresh(registration)
    return _to_ticket(registration)


@router.get("/my-tickets", response_model=List[TicketOut])
def my_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    registrations = (
        db.query(Registration)
        .options(joinedload(Registration.event), joinedload(Registration.checkin))
        .filter(Registration.user_id == current_user.id)
        .order_by(Registration.created_at.desc())
        .all()
    )
    return [_to_ticket(r) for r in registrations]


@router.get("/{registration_id}/download")
def download_ticket_pdf(
    registration_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Download ticket pass as a PDF."""
    registration = (
        db.query(Registration)
        .options(joinedload(Registration.event), joinedload(Registration.user))
        .filter(Registration.id == registration_id)
        .first()
    )
    if not registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Registration not found"
        )

    # Security check: only ticket holder or event organizer can download
    if (
        registration.user_id != current_user.id
        and registration.event.organizer_id != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to download this ticket",
        )

    formatted_date = registration.event.date_time.strftime("%B %d, %Y at %I:%M %p UTC")

    pdf_stream = generate_ticket_pdf(
        event_title=registration.event.title,
        event_date=formatted_date,
        event_location=registration.event.location,
        attendee_name=registration.user.name,
        attendee_email=registration.user.email,
        registration_code=registration.registration_code,
    )

    filename = f"ticket_{registration.registration_code[:8]}.pdf"
    return Response(
        content=pdf_stream.getvalue(),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
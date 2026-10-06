from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_owned_event, require_organizer, verify_event_owner
from app.models import Checkin, Event, Registration, User
from app.schemas.auth import _serialize_utc
from app.schemas.checkin import CheckinRequest, CheckinResponse, EventStatsOut
from app.services.stats_service import compute_event_stats

router = APIRouter(tags=["Check-in"])


def _duplicate_error(attendee_name: str, previous_checkin: Checkin) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_409_CONFLICT,
        detail={
            "status": "duplicate",
            "message": "Duplicate scan rejected: this ticket was already checked in",
            "attendee_name": attendee_name,
            "registration_id": previous_checkin.registration_id,
            "checked_in_at": _serialize_utc(previous_checkin.checked_in_at),
        },
    )


@router.post("/checkin/validate", response_model=CheckinResponse)
def validate_checkin(
    payload: CheckinRequest,
    db: Session = Depends(get_db),
    organizer: User = Depends(require_organizer),
):
    """
    Three outcomes:
      200 -> status "success": check-in recorded
      409 -> status "duplicate": already checked in (includes exact previous timestamp)
      404 -> status "invalid": unknown ticket, or ticket belongs to a different event
    """
    # Only the organizer who owns the event may scan for it
    event: Event = get_owned_event(db, payload.event_id, organizer)

    code = payload.registration_code.strip()
    registration = (
        db.query(Registration)
        .filter(
            Registration.registration_code == code,
            Registration.event_id == event.id,
        )
        .first()
    )
    if registration is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "status": "invalid",
                "message": "Invalid ticket: not found for this event",
            },
        )

    attendee_name = registration.user.name

    existing = (
        db.query(Checkin).filter(Checkin.registration_id == registration.id).first()
    )
    if existing is not None:
        raise _duplicate_error(attendee_name, existing)

    checkin = Checkin(registration_id=registration.id)
    db.add(checkin)
    try:
        db.commit()
    except IntegrityError:
        # A concurrent scan won the race; the unique constraint keeps this idempotent.
        db.rollback()
        existing = (
            db.query(Checkin)
            .filter(Checkin.registration_id == registration.id)
            .first()
        )
        if existing is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Could not record check-in",
            )
        raise _duplicate_error(attendee_name, existing)

    db.refresh(checkin)
    return CheckinResponse(
        status="success",
        message="Check-in successful",
        registration_id=registration.id,
        event_id=event.id,
        attendee_name=attendee_name,
        checked_in_at=checkin.checked_in_at,
    )


@router.get("/events/{event_id}/stats", response_model=EventStatsOut)
def event_stats(
    event: Event = Depends(verify_event_owner),
    db: Session = Depends(get_db),
):
    """Live organizer dashboard counts (owner only). Poll this from the frontend."""
    return compute_event_stats(db, event)

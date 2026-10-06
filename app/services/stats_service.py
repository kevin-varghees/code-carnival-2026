from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import Checkin, Event, Registration
from app.schemas.checkin import EventStatsOut


def compute_event_stats(db: Session, event: Event) -> EventStatsOut:
    registered = (
        db.query(func.count(Registration.id))
        .filter(Registration.event_id == event.id)
        .scalar()
        or 0
    )
    checked_in = (
        db.query(func.count(Checkin.id))
        .join(Registration, Registration.id == Checkin.registration_id)
        .filter(Registration.event_id == event.id)
        .scalar()
        or 0
    )
    return EventStatsOut(
        event_id=event.id,
        event_title=event.title,
        total_capacity=event.capacity,
        registered_count=registered,
        checked_in_count=checked_in,
        remaining_seats=max(event.capacity - registered, 0),
    )

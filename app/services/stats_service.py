from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import Checkin, Event, Registration
from app.schemas.checkin import EventStatsOut, RecentAttendeeActivity


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

    # Compute live percentages
    attendance_rate = (
        round((checked_in / registered) * 100, 2) if registered > 0 else 0.0
    )
    occupancy_rate = (
        round((registered / event.capacity) * 100, 2) if event.capacity > 0 else 0.0
    )

    # Fetch last 5 check-ins safely using known Checkin model attributes
    recent_records = (
        db.query(Checkin.id, Checkin.registration_id, Checkin.checked_in_at)
        .join(Registration, Registration.id == Checkin.registration_id)
        .filter(Registration.event_id == event.id)
        .order_by(Checkin.checked_in_at.desc())
        .limit(5)
        .all()
    )

    activity_feed = [
        RecentAttendeeActivity(
            checkin_id=row[0],
            registration_id=row[1],
            checked_in_at=row[2],
        )
        for row in recent_records
    ]

    return EventStatsOut(
        event_id=event.id,
        event_title=event.title,
        total_capacity=event.capacity,
        registered_count=registered,
        checked_in_count=checked_in,
        remaining_seats=max(event.capacity - registered, 0),
        attendance_rate_pct=attendance_rate,
        occupancy_rate_pct=occupancy_rate,
        recent_checkins=activity_feed,
    )
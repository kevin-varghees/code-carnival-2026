from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Event, User
from app.services.auth_service import decode_access_token

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credentials is None:
        raise unauthorized

    token_data = decode_access_token(credentials.credentials)
    if token_data is None or token_data.user_id is None:
        raise unauthorized

    user = db.query(User).filter(User.id == token_data.user_id).first()
    if user is None:
        raise unauthorized
    return user


def require_organizer(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "organizer":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Organizer access required",
        )
    return current_user


def get_owned_event(db: Session, event_id: int, user: User) -> Event:
    """Return the event if it exists and belongs to the organizer; otherwise raise."""
    event = db.query(Event).filter(Event.id == event_id).first()
    if event is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Event not found"
        )
    if event.organizer_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not own this event",
        )
    return event


def verify_event_owner(
    event_id: int,
    db: Session = Depends(get_db),
    organizer: User = Depends(require_organizer),
) -> Event:
    """Dependency for routes with {event_id} in the path."""
    return get_owned_event(db, event_id, organizer)

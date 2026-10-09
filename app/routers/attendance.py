from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.attendance import Registration

router = APIRouter(prefix="/api/attendance", tags=["Attendance"])

@router.post("/scan")
def scan_qr_code(qr_token: str, db: Session = Depends(get_db)):
    # Find registration by token
    registration = db.query(Registration).filter(Registration.qr_token == qr_token).first()
    
    if not registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Invalid QR Code: Registration not found."
        )
    
    if registration.is_checked_in:
        return {
            "status": "already_checked_in",
            "message": "User is already checked in!",
            "checked_in_at": registration.checked_in_at
        }
    
    # Update attendance
    registration.is_checked_in = True
    registration.checked_in_at = datetime.utcnow()
    db.commit()
    db.refresh(registration)
    
    return {
        "status": "success",
        "message": "Check-in successful! Status marked as Present.",
        "user_id": registration.user_id,
        "event_id": registration.event_id,
        "checked_in_at": registration.checked_in_at
    }
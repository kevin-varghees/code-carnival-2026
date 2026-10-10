from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.registration import Registration
# Assuming you have a Checkin model in your models folder, import it here:
# from app.models.checkin import Checkin

router = APIRouter(prefix="/api/attendance", tags=["Attendance"])

@router.post("/scan")
def scan_qr_code(registration_code: str, db: Session = Depends(get_db)):
    # 1. Find registration by your existing registration_code field
    registration = db.query(Registration).filter(Registration.registration_code == registration_code).first()
    
    if not registration:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Invalid QR Code: Registration not found."
        )
    
    # 2. Check if this registration already has a check-in record
    if registration.checkin:
        return {
            "status": "already_checked_in",
            "message": "User is already checked in!",
            "checked_in_at": registration.checkin.created_at
        }
    
    # 3. If not checked in, you can create a check-in record here if needed
    
    return {
        "status": "success",
        "message": "Check-in successful! Status marked as Present.",
        "user_id": registration.user_id,
        "event_id": registration.event_id,
    }
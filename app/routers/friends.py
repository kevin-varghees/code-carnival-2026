from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, and_
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models import User
from app.models.friendship import Friendship
from app.schemas.friends import (
    FriendResponseAction,
    FriendshipOut,
    PeerUserOut,
)

router = APIRouter(prefix="/friends", tags=["Friends & Peers"])


@router.get("/peers", response_model=List[PeerUserOut])
def list_peers(
    search: Optional[str] = Query(None, description="Search by name, university, or course"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List peer attendees with their connection status relative to the logged-in user."""
    query = db.query(User).filter(User.id != current_user.id)

    if search:
        search_filter = f"%{search.strip()}%"
        query = query.filter(
            or_(
                User.name.ilike(search_filter),
                User.university.ilike(search_filter),
                User.course.ilike(search_filter),
                User.interests.ilike(search_filter),
            )
        )

    users = query.all()

    # Pre-fetch friendships involving current user to quickly assign connection_status
    friendships = db.query(Friendship).filter(
        or_(Friendship.sender_id == current_user.id, Friendship.receiver_id == current_user.id)
    ).all()

    status_map = {}
    for f in friendships:
        if f.status == "accepted":
            other_id = f.receiver_id if f.sender_id == current_user.id else f.sender_id
            status_map[other_id] = "accepted"
        elif f.status == "pending":
            if f.sender_id == current_user.id:
                status_map[f.receiver_id] = "pending_sent"
            else:
                status_map[f.sender_id] = "pending_received"

    result = []
    for u in users:
        peer_data = PeerUserOut.model_validate(u)
        peer_data.connection_status = status_map.get(u.id, "none")
        result.append(peer_data)

    return result


@router.get("/peers/{user_id}", response_model=PeerUserOut)
def get_peer_profile(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Fetch details of a single peer for Peerprofilee.jsx."""
    peer = db.query(User).filter(User.id == user_id).first()
    if not peer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    friendship = db.query(Friendship).filter(
        or_(
            and_(Friendship.sender_id == current_user.id, Friendship.receiver_id == user_id),
            and_(Friendship.sender_id == user_id, Friendship.receiver_id == current_user.id),
        )
    ).first()

    conn_status = "none"
    if friendship:
        if friendship.status == "accepted":
            conn_status = "accepted"
        elif friendship.status == "pending":
            conn_status = "pending_sent" if friendship.sender_id == current_user.id else "pending_received"

    peer_data = PeerUserOut.model_validate(peer)
    peer_data.connection_status = conn_status
    return peer_data


@router.post("/request/{receiver_id}", status_code=status.HTTP_201_CREATED)
def send_friend_request(
    receiver_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Send a connection request to a peer."""
    if receiver_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot connect with yourself"
        )

    receiver = db.query(User).filter(User.id == receiver_id).first()
    if not receiver:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    existing = db.query(Friendship).filter(
        or_(
            and_(Friendship.sender_id == current_user.id, Friendship.receiver_id == receiver_id),
            and_(Friendship.sender_id == receiver_id, Friendship.receiver_id == current_user.id),
        )
    ).first()

    if existing:
        if existing.status == "accepted":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Already connected")
        if existing.status == "pending":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="A request is already pending")
        # If previously rejected, allow re-requesting
        existing.sender_id = current_user.id
        existing.receiver_id = receiver_id
        existing.status = "pending"
        db.commit()
        return {"message": "Connection request sent"}

    friendship = Friendship(sender_id=current_user.id, receiver_id=receiver_id, status="pending")
    db.add(friendship)
    db.commit()
    return {"message": "Connection request sent"}


@router.put("/request/{request_id}/respond")
def respond_friend_request(
    request_id: int,
    payload: FriendResponseAction,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Accept or reject an incoming connection request."""
    friendship = db.query(Friendship).filter(
        Friendship.id == request_id,
        Friendship.receiver_id == current_user.id,
        Friendship.status == "pending",
    ).first()

    if not friendship:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pending request not found")

    friendship.status = "accepted" if payload.action == "accept" else "rejected"
    db.commit()
    return {"message": f"Connection request {friendship.status}"}


@router.get("/my-friends", response_model=List[PeerUserOut])
def get_my_friends(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all accepted connections for the current user."""
    friendships = db.query(Friendship).filter(
        Friendship.status == "accepted",
        or_(Friendship.sender_id == current_user.id, Friendship.receiver_id == current_user.id),
    ).all()

    friend_ids = [
        f.receiver_id if f.sender_id == current_user.id else f.sender_id for f in friendships
    ]

    if not friend_ids:
        return []

    friends = db.query(User).filter(User.id.in_(friend_ids)).all()
    result = []
    for u in friends:
        item = PeerUserOut.model_validate(u)
        item.connection_status = "accepted"
        result.append(item)
    return result
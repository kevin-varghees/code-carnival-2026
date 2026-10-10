from datetime import datetime, timedelta
import uuid
from app.database import SessionLocal, Base, engine
from app.models import User, Event, Registration
from app.services.auth_service import get_password_hash
from app.services.qr_service import generate_event_code

def seed_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()

    try:
        print("🌱 Seeding fresh database records...")

        # 1. Create Sample Organizer and Student
        organizer = User(
            name="Dr. Aris Thorne",
            email="organizer@marwadiuniversity.ac.in",
            hashed_password=get_password_hash("password123"),
            role="organizer"
        )
        
        student1 = User(
            name="Kevin Varghees",
            email="kevin@marwadiuniversity.ac.in",
            hashed_password=get_password_hash("password123"),
            role="attendee"
        )

        db.add_all([organizer, student1])
        db.commit()

        # 2. Create Sample Events
        now = datetime.utcnow()
        
        events_data = [
            {
                "title": "AI Sparks '26: Agentic AI Workshop",
                "description": "A deep-dive hands-on session into autonomous agents, LangChain, and advanced generative AI frameworks.",
                "days_ahead": 3,
                "location": "Main Auditorium, Block A",
                "capacity": 150
            },
            {
                "title": "Code Carnival 3.0 Hackathon",
                "description": "24-hour offline coding marathon to build impactful full-stack and AI applications for social good.",
                "days_ahead": 7,
                "location": "University Tech Arena",
                "capacity": 300
            },
            {
                "title": "Robotics & ROS 2 Masterclass",
                "description": "Explore modern robotic middleware, computer vision integration with OpenCV, and automated navigation.",
                "days_ahead": 12,
                "location": "Robotics Lab, Tech Block",
                "capacity": 60
            },
            {
                "title": "UI/UX Design Sprint",
                "description": "Learn rapid prototyping, wireframing, and design systems using Figma.",
                "days_ahead": 15,
                "location": "Design Studio 3",
                "capacity": 80
            }
        ]

        for data in events_data:
            event = Event(
                event_code=generate_event_code(),
                title=data["title"],
                description=data["description"],
                date_time=now + timedelta(days=data["days_ahead"]),
                location=data["location"],
                capacity=data["capacity"],
                organizer_id=organizer.id
            )
            db.add(event)
        
        db.commit()

        # 3. Create Sample Registration for Kevin
        first_event = db.query(Event).first()
        if first_event:
            reg = Registration(
                registration_code=str(uuid.uuid4()),
                user_id=student1.id,
                event_id=first_event.id
            )
            db.add(reg)
            db.commit()

        print(f"✨ Successfully seeded {db.query(Event).count()} events into the database!")

    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
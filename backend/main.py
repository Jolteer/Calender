"""
FastAPI Backend for Calendar Application
Handles CRUD operations for calendar events with MongoDB storage
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="Calendar API")

# Enable CORS for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGODB_URL)
db = client.calendar_db
events_collection = db.events

# Pydantic models for request/response validation
class Event(BaseModel):
    """Event model matching your frontend event structure"""
    id: Optional[str] = None
    title: str
    date: str  # YYYY-MM-DD format
    startTime: str  # HH:MM format
    endTime: str  # HH:MM format
    description: Optional[str] = ""
    color: str = "#3B82F6"

class EventInDB(Event):
    """Event model with MongoDB _id"""
    pass

# API Routes
@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "Calendar API is running", "version": "1.0.0"}

@app.get("/events", response_model=List[Event])
async def get_events():
    """
    Retrieve all calendar events
    Returns: List of all events in the database
    """
    events = []
    async for event in events_collection.find():
        # Convert MongoDB _id to string id
        event["id"] = str(event.pop("_id"))
        events.append(event)
    return events

@app.post("/events", response_model=Event)
async def create_event(event: Event):
    """
    Create a new calendar event
    Args: event - Event object with title, date, times, etc.
    Returns: Created event with generated ID
    """
    event_dict = event.dict(exclude={"id"})
    event_dict["created_at"] = datetime.utcnow()
    
    result = await events_collection.insert_one(event_dict)
    event.id = str(result.inserted_id)
    
    return event

@app.put("/events/{event_id}", response_model=Event)
async def update_event(event_id: str, event: Event):
    """
    Update an existing event
    Args: event_id - ID of event to update
          event - Updated event data
    Returns: Updated event
    """
    from bson import ObjectId
    
    try:
        event_dict = event.dict(exclude={"id"})
        event_dict["updated_at"] = datetime.utcnow()
        
        result = await events_collection.update_one(
            {"_id": ObjectId(event_id)},
            {"$set": event_dict}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Event not found")
        
        event.id = event_id
        return event
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/events/{event_id}")
async def delete_event(event_id: str):
    """
    Delete an event
    Args: event_id - ID of event to delete
    Returns: Success message
    """
    from bson import ObjectId
    
    try:
        result = await events_collection.delete_one({"_id": ObjectId(event_id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Event not found")
        
        return {"message": "Event deleted successfully", "id": event_id}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.on_event("startup")
async def startup_event():
    """Initialize database connection on startup"""
    print("Connecting to MongoDB...")
    print(f"Database: {db.name}")

@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection on shutdown"""
    client.close()
    print("MongoDB connection closed")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

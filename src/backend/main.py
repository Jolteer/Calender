"""!
FastAPI Backend for Calendar Application
Handles CRUD operations for calendar events with MongoDB storage

This module provides a REST API for managing calendar events with the following features:
- Create, Read, Update, Delete (CRUD) operations for events
- MongoDB Atlas cloud database integration
- Input validation using Pydantic models
- CORS support for frontend communication
- Comprehensive error handling and logging
- Health check endpoint for monitoring
"""

# Import FastAPI framework components
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

# Import MongoDB async driver for non-blocking database operations
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase, AsyncIOMotorCollection

# Import Pydantic for data validation and serialization
from pydantic import BaseModel, Field, field_validator
from typing import Optional, List

# Import datetime for timestamp tracking
from datetime import datetime

# Import standard library modules
import os  # For environment variable access
import logging  # For application logging
from dotenv import load_dotenv  # For loading .env file

# Import BSON utilities for MongoDB ObjectId handling
from bson import ObjectId
from bson.errors import InvalidId

# ============================================================
# LOGGING CONFIGURATION
# ============================================================
# Set up logging to track API operations and errors
logging.basicConfig(
    level=logging.INFO,  # Log INFO level and above (INFO, WARNING, ERROR, CRITICAL)
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'  # Timestamp, logger name, level, message
)
logger = logging.getLogger(__name__)  # Create logger for this module

# ============================================================
# ENVIRONMENT VARIABLES
# ============================================================
# Load environment variables from .env file (contains MongoDB connection string)
load_dotenv()

# ============================================================
# APPLICATION CONFIGURATION
# ============================================================
# ============================================================
# APPLICATION CONFIGURATION
# ============================================================
class Config:
    """
    Centralized configuration constants for the Calendar API
    
    This class holds all configuration values used throughout the application,
    making it easy to modify settings in one place. All values are class-level
    constants that don't change during runtime.
    """
    
    # API Metadata
    APP_TITLE: str = "Calendar API"  # Displayed in API documentation
    APP_VERSION: str = "1.0.0"  # Semantic versioning (major.minor.patch)
    
    # Database Configuration
    DB_NAME: str = "calendar_db"  # Name of MongoDB database
    COLLECTION_NAME: str = "events"  # Name of events collection within database
    DEFAULT_HOST: str = "0.0.0.0"  # Listen on all network interfaces
    DEFAULT_PORT: int = 8000  # Default port for FastAPI server
    MONGODB_DEFAULT_URL: str = "mongodb://localhost:27017"  # Fallback if env var not set
    
    # CORS (Cross-Origin Resource Sharing) Settings
    # Allows frontend running on different domain/port to access API
    CORS_ORIGINS: List[str] = ["*"]  # "*" allows all origins (use specific URLs in production)
    CORS_ALLOW_CREDENTIALS: bool = True  # Allow cookies and authorization headers
    CORS_ALLOW_METHODS: List[str] = ["*"]  # Allow all HTTP methods (GET, POST, PUT, DELETE)
    CORS_ALLOW_HEADERS: List[str] = ["*"]  # Allow all headers
    
    # Input Validation Constants
    # These define maximum lengths and regex patterns for validating user input
    MAX_TITLE_LENGTH: int = 100  # Maximum characters for event title
    MAX_DESCRIPTION_LENGTH: int = 500  # Maximum characters for event description
    TIME_REGEX: str = r"^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"  # Validates HH:MM format (00:00 to 23:59)
    DATE_REGEX: str = r"^\d{4}-\d{2}-\d{2}$"  # Validates YYYY-MM-DD format
    COLOR_REGEX: str = r"^#[0-9A-Fa-f]{6}$"  # Validates hex color code (#RRGGBB)

# ============================================================
# FASTAPI APPLICATION SETUP
# ============================================================
# Create FastAPI application instance with metadata for API documentation
app = FastAPI(title=Config.APP_TITLE, version=Config.APP_VERSION)

# ============================================================
# CORS MIDDLEWARE
# ============================================================
# Add CORS middleware to allow frontend (running on different port) to communicate with API
# This must be added before any routes are defined
app.add_middleware(
    CORSMiddleware,
    allow_origins=Config.CORS_ORIGINS,  # Which domains can access the API
    allow_credentials=Config.CORS_ALLOW_CREDENTIALS,  # Allow sending cookies
    allow_methods=Config.CORS_ALLOW_METHODS,  # Which HTTP methods are allowed
    allow_headers=Config.CORS_ALLOW_HEADERS,  # Which headers are allowed
)

# ============================================================
# DATABASE CONNECTION
# ============================================================
# Get MongoDB connection URL from environment variable or use default
MONGODB_URL: str = os.getenv("MONGODB_URL", Config.MONGODB_DEFAULT_URL)

# Create async MongoDB client (non-blocking database operations)
client: AsyncIOMotorClient = AsyncIOMotorClient(MONGODB_URL)

# Get reference to the calendar database
db: AsyncIOMotorDatabase = client[Config.DB_NAME]

# Get reference to the events collection within the database
events_collection: AsyncIOMotorCollection = db[Config.COLLECTION_NAME]

# ============================================================
# PYDANTIC MODELS (DATA VALIDATION & SERIALIZATION)
# ============================================================
# ============================================================
# PYDANTIC MODELS (DATA VALIDATION & SERIALIZATION)
# ============================================================
class Event(BaseModel):
    """
    Event model for validating and serializing calendar event data
    
    This model defines the structure and validation rules for event data.
    Pydantic automatically validates incoming JSON against these rules and
    converts validated data to Python objects.
    
    Attributes:
        id: MongoDB ObjectId (optional for new events, required for existing)
        title: Event title (1-100 characters, required)
        date: Event date in YYYY-MM-DD format (required)
        startTime: Start time in HH:MM format (required)
        endTime: End time in HH:MM format (required, must be after startTime)
        description: Optional event description (max 500 characters)
        color: Event color in hex format (default: blue #3B82F6)
    """
    
    # Event ID - Optional for creation, required for updates
    id: Optional[str] = Field(None, description="Event ID (MongoDB ObjectId)")
    
    # Event title - Required, must be 1-100 characters
    title: str = Field(
        ...,  # ... means required
        min_length=1,  # At least 1 character
        max_length=Config.MAX_TITLE_LENGTH,  # Maximum 100 characters
        description="Event title"
    )
    
    # Event date - Required, must match YYYY-MM-DD pattern
    date: str = Field(
        ...,
        pattern=Config.DATE_REGEX,  # Validates format using regex
        description="Event date in YYYY-MM-DD format"
    )
    
    # Start time - Required, must match HH:MM pattern
    startTime: str = Field(
        ...,
        pattern=Config.TIME_REGEX,  # Validates 24-hour time format
        description="Start time in HH:MM format"
    )
    
    # End time - Required, must match HH:MM pattern and be after startTime
    endTime: str = Field(
        ...,
        pattern=Config.TIME_REGEX,
        description="End time in HH:MM format"
    )
    
    # Description - Optional, max 500 characters
    description: Optional[str] = Field(
        "",  # Default empty string
        max_length=Config.MAX_DESCRIPTION_LENGTH,
        description="Event description"
    )
    
    # Color - Required, must be valid hex color code
    color: str = Field(
        "#3B82F6",  # Default blue color
        pattern=Config.COLOR_REGEX,  # Validates hex format
        description="Event color in hex format"
    )
    
    @field_validator('endTime')
    @classmethod
    def validate_end_time(cls, end_time: str, info) -> str:
        """
        Custom validator to ensure end time is after start time
        
        This validator is automatically called by Pydantic during validation.
        It converts both times to minutes since midnight and compares them.
        
        Args:
            end_time: The end time to validate
            info: ValidationInfo object containing other field values
        
        Returns:
            str: The validated end time
        
        Raises:
            ValueError: If end time is not after start time
        """
        # Check if startTime has been validated yet
        if 'startTime' in info.data:
            start_time = info.data['startTime']
            
            # Split time strings into hours and minutes
            start_parts = start_time.split(':')
            end_parts = end_time.split(':')
            
            # Ensure both times have hours and minutes
            if len(start_parts) == 2 and len(end_parts) == 2:
                # Convert to total minutes since midnight for easy comparison
                start_minutes = int(start_parts[0]) * 60 + int(start_parts[1])
                end_minutes = int(end_parts[0]) * 60 + int(end_parts[1])
                
                # Validate that end time is after start time
                if end_minutes <= start_minutes:
                    raise ValueError('End time must be after start time')
        
        return end_time
    
    # Model configuration with example for API documentation
    model_config = {
        "json_schema_extra": {
            "example": {
                "title": "Team Meeting",
                "date": "2024-11-30",
                "startTime": "09:00",
                "endTime": "10:00",
                "description": "Weekly team sync",
                "color": "#3B82F6"
            }
        }
    }

class EventResponse(Event):
    """
    Event response model - extends Event with required ID
    
    This model is used for API responses to ensure that every returned
    event has an ID. Inherits all fields from Event model.
    """
    # Override the optional id from Event to make it required
    # In responses, ID is always present (generated by MongoDB)
    id: str = Field(..., description="Event ID")

class DeleteResponse(BaseModel):
    """
    Response model for successful delete operations
    
    Returns a confirmation message and the ID of the deleted event.
    """
    message: str = Field(..., description="Success message")
    id: str = Field(..., description="Deleted event ID")

class HealthResponse(BaseModel):
    """
    Response model for health check endpoint
    
    Provides information about API status, version, and database connectivity.
    Used for monitoring and ensuring the API is running properly.
    """
    status: str = Field(..., description="API status")
    version: str = Field(..., description="API version")
    database: str = Field(..., description="Database connection status")

# ============================================================
# API ROUTES (ENDPOINTS)
# ============================================================

@app.get("/", response_model=HealthResponse, tags=["Health"])
async def health_check() -> HealthResponse:
    """
    Health check endpoint - verifies API and database are running
    
    This endpoint is used to monitor the health of the API. It checks:
    1. If the API server is responsive
    2. If the database connection is working
    
    Returns:
        HealthResponse: Object containing:
            - status: "running" if API is operational
            - version: Current API version
            - database: "connected" or "disconnected"
    
    Example:
        GET http://localhost:8000/
        Response: {"status": "running", "version": "1.0.0", "database": "connected"}
    """
    try:
        # Attempt to ping MongoDB to verify connection
        await client.admin.command('ping')
        db_status = "connected"  # Connection successful
    except Exception as e:
        # Log the error and mark database as disconnected
        logger.error(f"Database connection failed: {e}")
        db_status = "disconnected"
    
    # Return health status
    return HealthResponse(
        status="running",
        version=Config.APP_VERSION,
        database=db_status
    )

@app.get("/events", response_model=List[EventResponse], tags=["Events"])
async def get_events() -> List[EventResponse]:
    """
    Retrieve all calendar events from the database
    
    This endpoint fetches all events stored in MongoDB and returns them as a list.
    Internal MongoDB fields (_id, created_at, updated_at) are processed:
    - _id is converted to string "id" for frontend compatibility
    - created_at and updated_at timestamps are removed from response
    
    Returns:
        List[EventResponse]: Array of all events in the database
    
    Raises:
        HTTPException: 500 error if database query fails
    
    Example:
        GET http://localhost:8000/events
        Response: [
            {
                "id": "507f1f77bcf86cd799439011",
                "title": "Team Meeting",
                "date": "2024-11-30",
                "startTime": "09:00",
                "endTime": "10:00",
                "description": "Weekly sync",
                "color": "#3B82F6"
            },
            ...
        ]
    """
    try:
        events: List[EventResponse] = []
        
        # Iterate through all documents in the events collection
        # Using async for to avoid blocking the event loop
        async for event in events_collection.find():
            # Convert MongoDB's _id ObjectId to string and rename to "id"
            event["id"] = str(event.pop("_id"))
            
            # Remove internal timestamp fields (not needed in frontend)
            event.pop("created_at", None)  # None means don't error if field doesn't exist
            event.pop("updated_at", None)
            
            # Create EventResponse object and add to list
            events.append(EventResponse(**event))
        
        # Log successful retrieval
        logger.info(f"Retrieved {len(events)} events")
        return events
        
    except Exception as e:
        # Log error and return 500 status code
        logger.error(f"Failed to retrieve events: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve events"
        )

@app.post("/events", response_model=EventResponse, status_code=status.HTTP_201_CREATED, tags=["Events"])
async def create_event(event: Event) -> EventResponse:
    """
    Create a new calendar event in the database
    
    This endpoint:
    1. Validates the incoming event data against the Event model
    2. Adds timestamps (created_at, updated_at)
    3. Inserts the event into MongoDB
    4. Returns the created event with its new ID
    
    Args:
        event (Event): Event object from request body (automatically validated by Pydantic)
    
    Returns:
        EventResponse: The created event with generated ID and 201 status code
    
    Raises:
        HTTPException: 500 error if database insertion fails
        HTTPException: 422 error if validation fails (automatic)
    
    Example:
        POST http://localhost:8000/events
        Body: {
            "title": "Team Meeting",
            "date": "2024-11-30",
            "startTime": "09:00",
            "endTime": "10:00",
            "description": "Weekly sync",
            "color": "#3B82F6"
        }
        Response (201): {
            "id": "507f1f77bcf86cd799439011",
            "title": "Team Meeting",
            ...
        }
    """
    try:
        # Convert Event model to dictionary, excluding None values and ID
        # (ID will be auto-generated by MongoDB)
        event_dict = event.model_dump(exclude={"id"}, exclude_none=True)
        
        # Add timestamp fields to track when event was created/updated
        event_dict["created_at"] = datetime.utcnow()  # Current UTC time
        event_dict["updated_at"] = datetime.utcnow()
        
        # Insert document into MongoDB collection
        # Returns InsertOneResult with inserted_id
        result = await events_collection.insert_one(event_dict)
        
        # Create response object with the new ID
        created_event = EventResponse(
            id=str(result.inserted_id),  # Convert ObjectId to string
            **event.model_dump(exclude={"id"})  # Spread other event fields
        )
        
        # Log successful creation
        logger.info(f"Created event: {created_event.id} - {created_event.title}")
        return created_event
        
    except Exception as e:
        # Log error and return 500 status code
        logger.error(f"Failed to create event: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create event"
        )

@app.put("/events/{event_id}", response_model=EventResponse, tags=["Events"])
async def update_event(event_id: str, event: Event) -> EventResponse:
    """
    Update an existing calendar event
    
    This endpoint:
    1. Validates the event_id is a valid MongoDB ObjectId
    2. Validates the updated event data
    3. Updates the document in MongoDB
    4. Returns the updated event
    
    Args:
        event_id (str): MongoDB ObjectId of the event to update (from URL path)
        event (Event): Updated event data (from request body)
    
    Returns:
        EventResponse: The updated event with 200 status code
    
    Raises:
        HTTPException: 400 error if event_id format is invalid
        HTTPException: 404 error if event not found
        HTTPException: 422 error if validation fails (automatic)
        HTTPException: 500 error if database update fails
    
    Example:
        PUT http://localhost:8000/events/507f1f77bcf86cd799439011
        Body: {
            "title": "Updated Meeting",
            "date": "2024-11-30",
            "startTime": "10:00",
            "endTime": "11:00",
            "description": "Updated description",
            "color": "#10B981"
        }
        Response (200): {"id": "507f1f77bcf86cd799439011", "title": "Updated Meeting", ...}
    """
    # Step 1: Validate event_id format
    try:
        # Convert string ID to MongoDB ObjectId
        # This will raise InvalidId exception if format is wrong
        object_id = ObjectId(event_id)
    except (InvalidId, Exception):
        # Log warning and return 400 Bad Request
        logger.warning(f"Invalid event ID format: {event_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid event ID format"
        )
    
    # Step 2: Update the event
    try:
        # Convert Event model to dictionary for MongoDB update
        event_dict = event.model_dump(exclude={"id"}, exclude_none=True)
        
        # Update the updated_at timestamp
        event_dict["updated_at"] = datetime.utcnow()
        
        # Perform MongoDB update operation
        # $set operator replaces field values
        result = await events_collection.update_one(
            {"_id": object_id},  # Find document by _id
            {"$set": event_dict}  # Set new values
        )
        
        # Step 3: Check if event was found
        if result.matched_count == 0:
            # No document matched the ID
            logger.warning(f"Event not found: {event_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
        
        # Step 4: Create response with updated data
        updated_event = EventResponse(
            id=event_id,
            **event.model_dump(exclude={"id"})
        )
        
        # Log successful update
        logger.info(f"Updated event: {event_id} - {event.title}")
        return updated_event
        
    except HTTPException:
        # Re-raise HTTP exceptions (404, etc.)
        raise
    except Exception as e:
        # Log unexpected errors and return 500
        logger.error(f"Failed to update event {event_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update event"
        )

@app.delete("/events/{event_id}", response_model=DeleteResponse, tags=["Events"])
async def delete_event(event_id: str) -> DeleteResponse:
    """
    Delete a calendar event from the database
    
    This endpoint:
    1. Validates the event_id is a valid MongoDB ObjectId
    2. Attempts to delete the event from the database
    3. Returns confirmation of deletion
    
    Args:
        event_id (str): MongoDB ObjectId of the event to delete (from URL path)
    
    Returns:
        DeleteResponse: Success message and deleted event ID with 200 status code
    
    Raises:
        HTTPException: 400 error if event_id format is invalid
        HTTPException: 404 error if event not found
        HTTPException: 500 error if database deletion fails
    
    Example:
        DELETE http://localhost:8000/events/507f1f77bcf86cd799439011
        Response (200): {
            "message": "Event deleted successfully",
            "id": "507f1f77bcf86cd799439011"
        }
    """
    # Step 1: Validate event_id format
    try:
        # Convert string ID to MongoDB ObjectId
        object_id = ObjectId(event_id)
    except (InvalidId, Exception):
        # Log warning and return 400 Bad Request
        logger.warning(f"Invalid event ID format: {event_id}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid event ID format"
        )
    
    # Step 2: Delete the event
    try:
        # Perform MongoDB delete operation
        result = await events_collection.delete_one({"_id": object_id})
        
        # Step 3: Check if event was found and deleted
        if result.deleted_count == 0:
            # No document was deleted (event didn't exist)
            logger.warning(f"Event not found for deletion: {event_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Event not found"
            )
        
        # Log successful deletion
        logger.info(f"Deleted event: {event_id}")
        
        # Return success response
        return DeleteResponse(
            message="Event deleted successfully",
            id=event_id
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions (404, etc.)
        raise
    except Exception as e:
        # Log unexpected errors and return 500
        logger.error(f"Failed to delete event {event_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete event"
        )

# ============================================================
# APPLICATION LIFECYCLE EVENTS
# ============================================================

@app.on_event("startup")
async def startup_event():
    """
    Startup event handler - runs when the API server starts
    
    This function is called once when the FastAPI application starts up.
    It's used to:
    - Log startup information
    - Verify database connection
    - Perform any initialization tasks
    """
    print("Connecting to MongoDB...")
    print(f"Database: {db.name}")
    # Note: The actual connection is lazy - it happens on first database operation

@app.on_event("shutdown")
async def shutdown_event():
    """
    Shutdown event handler - runs when the API server stops
    
    This function is called once when the FastAPI application shuts down.
    It's used to:
    - Close database connections
    - Clean up resources
    - Log shutdown information
    """
    client.close()  # Close MongoDB connection
    print("MongoDB connection closed")

# ============================================================
# MAIN ENTRY POINT
# ============================================================

if __name__ == "__main__":
    """
    Main entry point when running this file directly
    
    This block only executes when running: python main.py
    It won't execute when importing this module or using uvicorn command.
    
    The uvicorn server will:
    - Listen on all network interfaces (0.0.0.0)
    - Use port 8000
    - Automatically reload on code changes (if --reload flag added)
    """
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# Calendar API Backend

FastAPI backend for the Calendar application with MongoDB storage.

## Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Install MongoDB:**
   - **Option A: Local MongoDB**
     - Download from https://www.mongodb.com/try/download/community
     - Install and run MongoDB locally on port 27017
   
   - **Option B: MongoDB Atlas (Cloud)**
     - Create free account at https://www.mongodb.com/cloud/atlas
     - Create a cluster and get connection string
     - Update `.env` file with your connection string

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   ```

4. **Run the API:**
   ```bash
   python main.py
   ```
   
   Or with uvicorn:
   ```bash
   uvicorn main:app --reload
   ```

## API Endpoints

- `GET /` - Health check
- `GET /events` - Get all events
- `POST /events` - Create new event
- `PUT /events/{event_id}` - Update event
- `DELETE /events/{event_id}` - Delete event

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing

Test the API with curl:

```bash
# Get all events
curl http://localhost:8000/events

# Create an event
curl -X POST http://localhost:8000/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Event",
    "date": "2025-11-29",
    "startTime": "10:00",
    "endTime": "11:00",
    "description": "Test description",
    "color": "#3B82F6"
  }'
```

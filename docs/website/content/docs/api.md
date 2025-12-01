---
title: "🔌 API Reference"
date: 2025-12-01
draft: false
description: "REST API documentation for the Calendar Application"
showToc: true
TocOpen: true
weight: 3
---

## Base URL

```
http://localhost:8000
```

---

## Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check |
| `GET` | `/events` | Get all events |
| `POST` | `/events` | Create new event |
| `PUT` | `/events/{id}` | Update event |
| `DELETE` | `/events/{id}` | Delete event |

---

## Health Check

### `GET /`

Verify API and database status.

**Request:**
```bash
curl http://localhost:8000/
```

**Response:**
```json
{
  "status": "running",
  "version": "1.0.0",
  "database": "connected"
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| `200` | Service healthy |

---

## List Events

### `GET /events`

Retrieve all calendar events.

**Request:**
```bash
curl http://localhost:8000/events
```

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "title": "Team Meeting",
    "date": "2024-11-30",
    "startTime": "09:00",
    "endTime": "10:00",
    "description": "Weekly sync",
    "color": "#3B82F6"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "title": "Lunch Break",
    "date": "2024-11-30",
    "startTime": "12:00",
    "endTime": "13:00",
    "description": "",
    "color": "#10B981"
  }
]
```

**Status Codes:**
| Code | Description |
|------|-------------|
| `200` | Success |
| `500` | Database error |

---

## Create Event

### `POST /events`

Create a new calendar event.

**Request:**
```bash
curl -X POST http://localhost:8000/events \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Team Meeting",
    "date": "2024-11-30",
    "startTime": "09:00",
    "endTime": "10:00",
    "description": "Weekly sync",
    "color": "#3B82F6"
  }'
```

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Event name (1-100 chars) |
| `date` | string | ✅ | Date in YYYY-MM-DD format |
| `startTime` | string | ✅ | Start time in HH:MM format |
| `endTime` | string | ✅ | End time in HH:MM format |
| `description` | string | ❌ | Event description (max 500 chars) |
| `color` | string | ✅ | Hex color code (#RRGGBB) |

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Team Meeting",
  "date": "2024-11-30",
  "startTime": "09:00",
  "endTime": "10:00",
  "description": "Weekly sync",
  "color": "#3B82F6"
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| `201` | Event created |
| `422` | Validation error |
| `500` | Database error |

---

## Update Event

### `PUT /events/{id}`

Update an existing event.

**Request:**
```bash
curl -X PUT http://localhost:8000/events/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Meeting",
    "date": "2024-11-30",
    "startTime": "10:00",
    "endTime": "11:00",
    "description": "Rescheduled",
    "color": "#F59E0B"
  }'
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | MongoDB ObjectId |

**Request Body:** Same as POST

**Response:**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "title": "Updated Meeting",
  "date": "2024-11-30",
  "startTime": "10:00",
  "endTime": "11:00",
  "description": "Rescheduled",
  "color": "#F59E0B"
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| `200` | Event updated |
| `400` | Invalid ID format |
| `404` | Event not found |
| `422` | Validation error |
| `500` | Database error |

---

## Delete Event

### `DELETE /events/{id}`

Delete an event.

**Request:**
```bash
curl -X DELETE http://localhost:8000/events/507f1f77bcf86cd799439011
```

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | MongoDB ObjectId |

**Response:**
```json
{
  "message": "Event deleted successfully",
  "id": "507f1f77bcf86cd799439011"
}
```

**Status Codes:**
| Code | Description |
|------|-------------|
| `200` | Event deleted |
| `400` | Invalid ID format |
| `404` | Event not found |
| `500` | Database error |

---

## Error Responses

### Validation Error (422)

```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### Not Found (404)

```json
{
  "detail": "Event not found"
}
```

### Server Error (500)

```json
{
  "detail": "Failed to create event"
}
```

---

## Validation Rules

### Title
- Required
- 1-100 characters
- String type

### Date
- Required
- Format: `YYYY-MM-DD`
- Regex: `^\d{4}-\d{2}-\d{2}$`

### Time Fields
- Required
- Format: `HH:MM`
- Regex: `^\d{2}:\d{2}$`
- End time must be after start time

### Description
- Optional
- Maximum 500 characters

### Color
- Required
- Format: `#RRGGBB`
- Regex: `^#[0-9A-Fa-f]{6}$`

---

## JavaScript Examples

### Fetch All Events

```javascript
async function getEvents() {
  const response = await fetch('http://localhost:8000/events');
  const events = await response.json();
  return events;
}
```

### Create Event

```javascript
async function createEvent(eventData) {
  const response = await fetch('http://localhost:8000/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create event');
  }
  
  return response.json();
}

// Usage
createEvent({
  title: 'New Meeting',
  date: '2024-12-01',
  startTime: '14:00',
  endTime: '15:00',
  description: 'Important discussion',
  color: '#3B82F6'
});
```

### Update Event

```javascript
async function updateEvent(id, eventData) {
  const response = await fetch(`http://localhost:8000/events/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update event');
  }
  
  return response.json();
}
```

### Delete Event

```javascript
async function deleteEvent(id) {
  const response = await fetch(`http://localhost:8000/events/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Failed to delete event');
  }
  
  return response.json();
}
```

---

## Python Examples

### Using requests

```python
import requests

BASE_URL = 'http://localhost:8000'

# Get all events
response = requests.get(f'{BASE_URL}/events')
events = response.json()

# Create event
new_event = {
    'title': 'Python Meeting',
    'date': '2024-12-01',
    'startTime': '10:00',
    'endTime': '11:00',
    'description': 'Discuss Python code',
    'color': '#8B5CF6'
}
response = requests.post(f'{BASE_URL}/events', json=new_event)
created = response.json()

# Update event
updated_event = {**new_event, 'title': 'Updated Python Meeting'}
response = requests.put(f'{BASE_URL}/events/{created["id"]}', json=updated_event)

# Delete event
response = requests.delete(f'{BASE_URL}/events/{created["id"]}')
```

---

## Interactive Documentation

FastAPI provides automatic interactive API documentation:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

These interfaces allow you to:
- Browse all endpoints
- See request/response schemas
- Test API calls directly in browser


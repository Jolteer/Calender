---
title: "🏗️ Architecture"
date: 2025-12-01
draft: false
description: "Technical architecture and design documentation"
showToc: true
TocOpen: true
weight: 2
---

## System Overview

The Calendar Application is a **full-stack web application** for event management with a clean separation of concerns.

### High-Level Architecture

```
┌─────────────────────────────────────────┐
│           WEB BROWSER                    │
│    (HTML5 / CSS3 / JavaScript ES6+)     │
└─────────────────┬───────────────────────┘
                  │ HTTP (REST API)
                  │ fetch() / async-await
┌─────────────────▼───────────────────────┐
│           FASTAPI SERVER                 │
│        (Python / Pydantic)              │
│           Port 8000                      │
└─────────────────┬───────────────────────┘
                  │ Motor (Async Driver)
┌─────────────────▼───────────────────────┐
│           MONGODB ATLAS                  │
│        (Cloud NoSQL Database)           │
│         Database: calendar_db           │
└─────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| HTML5 | - | Semantic markup, ARIA |
| CSS3 | - | Custom properties, animations |
| JavaScript | ES6+ | Classes, async/await |
| Bootstrap | 5.3.0 | Responsive framework |
| Bootstrap Icons | 1.10.0 | UI iconography |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.7+ | Core language |
| FastAPI | 0.122.0 | Async web framework |
| Uvicorn | Latest | ASGI server |
| Pydantic | 2.12.3 | Data validation |
| Motor | 3.7.1 | Async MongoDB driver |

### Database

| Technology | Type | Purpose |
|------------|------|---------|
| MongoDB Atlas | Cloud NoSQL | Event storage |

---

## Design Patterns

### 1. Singleton Pattern

**Usage:** Calendar class instance  
**Purpose:** Single source of truth for app state

```javascript
// Only one Calendar instance created
const calendar = new Calendar();
```

### 2. Module Pattern

**Usage:** Calendar class encapsulation  
**Purpose:** Data hiding and organization

```javascript
class Calendar {
    constructor() {
        this.events = [];      // Private to instance
        this.currentDate = new Date();
    }
}
```

### 3. Observer Pattern

**Usage:** Event listeners  
**Purpose:** React to user actions

```javascript
saveEventBtn.addEventListener('click', () => {
    this.saveEventForm();
});
```

### 4. Factory Pattern

**Usage:** Event element creation  
**Purpose:** Consistent DOM element generation

```javascript
createEventElement(event) {
    const eventEl = document.createElement('div');
    eventEl.className = 'event-item';
    return eventEl;
}
```

### 5. Strategy Pattern

**Usage:** View switching  
**Purpose:** Different rendering algorithms

```javascript
switchView(view) {
    if (view === 'month') {
        this.renderMonthlyView();
    } else if (view === 'week') {
        this.renderWeeklyView();
    }
}
```

### 6. Repository Pattern

**Usage:** Data access abstraction  
**Purpose:** Abstract storage mechanism

```javascript
async loadEvents() {
    const response = await fetch(API_URL + '/events');
    return response.json();
}
```

---

## Database Schema

### Events Collection

```json
{
  "_id": "ObjectId",
  "title": "String (1-100 chars)",
  "date": "String (YYYY-MM-DD)",
  "startTime": "String (HH:MM)",
  "endTime": "String (HH:MM)",
  "description": "String (0-500 chars)",
  "color": "String (#RRGGBB)",
  "created_at": "DateTime",
  "updated_at": "DateTime"
}
```

### Field Constraints

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| title | String | Yes | 1-100 characters |
| date | String | Yes | YYYY-MM-DD regex |
| startTime | String | Yes | HH:MM regex |
| endTime | String | Yes | HH:MM, after start |
| description | String | No | Max 500 chars |
| color | String | Yes | Hex color regex |

---

## Request Flow

```
1. User Action     → User clicks day/event in browser
2. Event Trigger   → JavaScript event listener fires
3. API Call        → fetch() sends HTTP request to FastAPI
4. Validation      → Pydantic validates request data
5. Database Op     → Motor executes MongoDB query
6. Response        → JSON data returned to frontend
7. UI Update       → JavaScript updates DOM with new data
```

---

## Layered Architecture

### Presentation Layer (Frontend)
- HTML templates
- CSS styling
- JavaScript Calendar class

### Business Logic Layer (Backend)
- FastAPI route handlers
- Data validation (Pydantic)
- Error handling

### Data Access Layer
- Motor async MongoDB client
- Database queries
- Data models

---

## Frontend Structure

### JavaScript Class Organization

```
Calendar
├── Static Constants (60+)
├── Constructor
├── Initialization Methods
│   ├── init()
│   ├── cacheElements()
│   └── setupEventListeners()
├── View Rendering Methods
│   ├── renderMonthlyView()
│   ├── renderWeeklyView()
│   └── updateCurrentPeriod()
├── Event Management Methods
│   ├── openEventModal()
│   ├── saveEventForm()
│   └── deleteEvent()
└── Utility Methods
    ├── validateEventData()
    ├── sanitizeHTML()
    └── formatTime()
```

### Error Handling

```javascript
CalendarError (Base)
├── APIError (HTTP errors)
│   ├── statusCode
│   └── originalError
└── ValidationError (Input errors)
    └── field
```

---

## Backend Structure

### FastAPI Application

```python
# Application layers
Config              # Constants & configuration
Pydantic Models     # Data validation
├── Event           # Input model
├── EventResponse   # Output model
└── DeleteResponse  # Delete confirmation

API Routes          # Endpoint handlers
├── Health check    # GET /
├── Get events      # GET /events
├── Create event    # POST /events
├── Update event    # PUT /events/{id}
└── Delete event    # DELETE /events/{id}

Database Layer      # MongoDB operations
└── AsyncIOMotorClient
```

### Validation Pipeline

```
1. HTTP Request arrives at FastAPI
2. Pydantic Model validates JSON structure
3. Field Validators check individual fields
4. Type Checking ensures correct data types
5. Error Response if validation fails (422)
6. Proceed to route handler if valid
```

---

## Performance Optimizations

### Frontend
- **DOM Element Caching** - Store references, avoid repeated queries
- **DocumentFragment** - Build DOM off-screen, single append
- **Map-based Grouping** - O(n) instead of O(n²)
- **Event Delegation** - Single listener on parent
- **CSS Transitions** - Hardware-accelerated animations

### Backend
- **Async Operations** - Non-blocking I/O with Motor
- **Connection Pooling** - MongoDB client reuses connections
- **Efficient Queries** - No N+1 query problems

---

## Security Considerations

### Frontend
- **XSS Prevention** - `sanitizeHTML()` escapes user input
- **Input Validation** - Client-side validation before API
- **No Sensitive Data** - Credentials only in backend `.env`

### Backend
- **CORS Configuration** - Control allowed origins
- **Input Validation** - Pydantic validates all inputs
- **ObjectId Validation** - Prevent invalid ID injection
- **Environment Variables** - Secrets in `.env` file

---

## Code Quality

### Best Practices Applied

✅ **DRY** - Constants, reusable functions, CSS variables  
✅ **SOLID** - Single responsibility, open/closed  
✅ **Error Handling** - Try-catch, meaningful messages  
✅ **Documentation** - JSDoc, Python docstrings  
✅ **Naming** - camelCase JS, snake_case Python  

---

## Future Enhancements

### Planned Features
- User Authentication
- Recurring Events
- Event Sharing
- Mobile PWA

### Technical Improvements
- Automated Tests (Jest, pytest)
- Event Pagination
- Service Worker Caching
- Database Indexes


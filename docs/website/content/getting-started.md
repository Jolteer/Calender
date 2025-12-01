---
title: "🚀 Getting Started"
date: 2025-12-01
draft: false
description: "Quick start guide to set up and run the Calendar Application"
showToc: true
TocOpen: true
---

## System Requirements

Before you begin, make sure you have:

| Requirement | Version |
|-------------|---------|
| **Browser** | Chrome, Firefox, Edge, or Safari (latest) |
| **Python** | 3.7 or higher |
| **pip** | Latest version |
| **Internet** | Required for MongoDB Atlas connection |

---

## Quick Start (Frontend Only)

For a quick preview using **localStorage** (no database required):

### Step 1: Download the Project

```bash
git clone https://github.com/Jolteer/Calendar.git
cd Calendar
```

### Step 2: Open in Browser

Simply open `src/frontend/index.html` in your web browser!

```
📁 src/
  📁 frontend/
    📄 index.html  ← Open this file
    📁 css/
    📁 js/
```

That's it! The calendar works immediately with local storage.

---

## Full Setup (With Backend)

For the complete experience with MongoDB cloud storage:

### Step 1: Clone the Repository

```bash
git clone https://github.com/Jolteer/Calendar.git
cd Calendar
```

### Step 2: Set Up the Backend

```bash
# Navigate to backend directory
cd src/backend

# Install Python dependencies
pip install -r requirements.txt
```

### Step 3: Configure MongoDB

Create a `.env` file in the `src/backend` directory:

```bash
# src/backend/.env
MONGODB_URL=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/?retryWrites=true&w=majority
```

> **Note:** Sign up for a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account to get your connection string.

### Step 4: Start the Backend Server

```bash
# Still in src/backend directory
python -m uvicorn main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
INFO:     Successfully connected to MongoDB!
```

### Step 5: Open the Frontend

Open `src/frontend/index.html` in your browser, or use VS Code's Live Server extension.

---

## Project Structure

```
Calendar-App/
├── 📁 docs/                    # Documentation
│   ├── architecture.md         # Architecture docs
│   ├── user_manual.md          # User manual
│   └── presentation.md         # Project presentation
│
├── 📁 src/                     # Source code
│   ├── 📁 frontend/            # Frontend application
│   │   ├── index.html          # Main HTML file
│   │   ├── css/
│   │   │   └── styles.css      # Styling
│   │   └── js/
│   │       └── script.js       # Calendar logic
│   │
│   └── 📁 backend/             # Backend API
│       ├── main.py             # FastAPI server
│       ├── requirements.txt    # Python dependencies
│       └── .env                # Environment variables
│
├── 📁 tests/                   # Test files
│   ├── test_calendar.js        # Frontend tests
│   └── test_main.py            # Backend tests
│
└── README.md                   # Project readme
```

---

## Verifying Installation

### Check Backend Health

Visit `http://localhost:8000` in your browser. You should see:

```json
{
  "status": "running",
  "version": "1.0.0",
  "database": "connected"
}
```

### Check API Documentation

FastAPI provides automatic API docs:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

---

## First Steps

### Create Your First Event

1. **Click any day** on the calendar
2. **Fill in the form**:
   - Title: "My First Event"
   - Start Time: 09:00
   - End Time: 10:00
   - Pick a color
3. **Click "Save Event"**
4. See your event appear on the calendar! 🎉

### Try Different Views

- Click **"Monthly"** for the traditional calendar grid
- Click **"Weekly"** for detailed day columns
- Use **"Previous"** and **"Next"** to navigate
- Click **"Today"** to jump back to current date

---

## Troubleshooting

### Backend Won't Start

**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Solution:**
```bash
pip install -r requirements.txt
```

---

### MongoDB Connection Failed

**Error:** `Cannot connect to MongoDB`

**Solutions:**
1. Check your `.env` file has the correct connection string
2. Verify your IP address is whitelisted in MongoDB Atlas
3. Check your internet connection

---

### CORS Errors in Browser

**Error:** `Access to fetch blocked by CORS policy`

**Solution:**
Make sure the backend is running on `localhost:8000`. The frontend expects this exact address.

---

### Events Not Saving

**Possible causes:**
1. Backend server not running
2. MongoDB connection failed
3. Browser console may show specific errors

**Check:**
1. Press `F12` to open browser DevTools
2. Go to **Console** tab
3. Look for red error messages

---

## Next Steps

Now that you're set up, explore:

- 📖 **[Features](/features/)** - Learn all the capabilities
- 📚 **[Documentation](/docs/)** - Deep dive into architecture
- 🎮 **[Demo](/demo/)** - Try it live

---

## Need Help?

- Check the [GitHub Issues](https://github.com/Jolteer/Calendar/issues)
- Read the full [User Manual](/docs/user-manual/)
- Review the [Architecture Documentation](/docs/architecture/)


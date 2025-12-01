---
title: "🎮 Demo"
date: 2025-12-01
draft: false
description: "Try the Calendar Application demo"
showToc: false
---

## Live Demo

The Calendar Application demo showcases all the features of the application.

### Quick Preview

{{< rawhtml >}}
<div style="text-align: center; margin: 2rem 0;">
  <a href="../../src/frontend/index.html" target="_blank" style="
    display: inline-block;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: bold;
    font-size: 1.2rem;
    box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4);
    transition: transform 0.2s, box-shadow 0.2s;
  " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(14, 165, 233, 0.5)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(14, 165, 233, 0.4)';">
    🚀 Launch Demo
  </a>
</div>
{{< /rawhtml >}}

---

## Demo Features

### 📅 Monthly View
- See the entire month at a glance
- Today highlighted with gradient
- Click any day to add events

### 📊 Weekly View  
- Detailed week schedule
- Perfect for busy days
- See time conflicts easily

### ➕ Create Events
- Click any day
- Fill in title, time, description
- Choose from 7 colors

### ✏️ Edit & Delete
- Click any event to modify
- Update or remove easily
- Changes save instantly

---

## Try These Actions

### 1. Create Your First Event
1. Click on **today's date**
2. Enter "Test Event" as title
3. Set times (e.g., 09:00 - 10:00)
4. Pick a **color**
5. Click **Save Event**

### 2. Switch Views
1. Click **"Weekly"** button
2. See your event in week view
3. Click **"Monthly"** to return

### 3. Edit an Event
1. Click on your **event**
2. Change the **title** or **color**
3. Click **Save Event**

### 4. Delete an Event
1. Click on your **event**
2. Click **Delete Event** (red button)
3. Event is removed!

---

## Running Locally

To run the full demo with backend:

```bash
# Clone the repository
git clone https://github.com/Jolteer/Calendar.git
cd Calendar

# Start backend
cd src/backend
pip install -r requirements.txt
python -m uvicorn main:app --reload

# Open frontend
# Open src/frontend/index.html in browser
```

---

## Screenshots

### Monthly View
The default calendar view showing a full month grid with events displayed as colored badges.

### Weekly View  
A detailed view showing each day as a column, perfect for planning busy weeks.

### Event Modal
The form for creating and editing events with title, time, description, and color picker.

---

## Source Code

Explore the source code:

- **Frontend**: `src/frontend/`
  - `index.html` - Main HTML
  - `css/styles.css` - Styling
  - `js/script.js` - Calendar logic

- **Backend**: `src/backend/`
  - `main.py` - FastAPI server
  - `requirements.txt` - Dependencies

- **Repository**: [GitHub](https://github.com/Jolteer/Calendar)


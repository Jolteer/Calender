---
title: "📖 User Manual"
date: 2025-12-01
draft: false
description: "Complete user guide for the Calendar Application"
showToc: true
TocOpen: true
weight: 1
---

## Introduction

Welcome to the **Calendar Application** - a modern, feature-rich calendar designed for efficient event management. This manual covers everything you need to know to get the most out of your calendar.

---

## Getting Started

### System Requirements

| Requirement | Minimum |
|-------------|---------|
| Browser | Chrome, Firefox, Edge, Safari (latest) |
| Screen | 1024x768 resolution |
| Internet | Required for database sync |

### First Launch

1. **Start the Backend Server**
   ```bash
   cd src/backend
   python -m uvicorn main:app --reload
   ```

2. **Open the Application**
   - Open `src/frontend/index.html` in your browser
   - Or use VS Code Live Server extension

3. **You're Ready!**
   - Calendar loads with current month
   - Live clock displays current time
   - Events sync from the database

---

## Monthly View

The monthly view shows a traditional calendar grid layout.

### Features
- **7 columns** for days of the week (SUN-SAT)
- **Up to 6 rows** for weeks
- **Today** highlighted with blue gradient
- **Events** shown as colored badges

### Navigation
| Button | Action |
|--------|--------|
| **← Previous** | Go back one month |
| **Next →** | Go forward one month |
| **Today** | Jump to current month |

---

## Weekly View

The weekly view provides a detailed look at your week.

### Features
- **7 vertical columns** (one per day)
- **Full event details** visible
- **Event times** displayed prominently
- **More space** for descriptions

### Switching Views
1. Click **"Weekly"** button in top-right
2. Calendar switches to week view
3. Click **"Monthly"** to switch back

---

## Creating Events

### Step-by-Step

1. **Click any day** in the calendar
2. **Event form** opens in a modal
3. **Fill in details:**

| Field | Required | Description |
|-------|----------|-------------|
| Title | ✅ Yes | Event name (1-100 chars) |
| Date | ✅ Yes | Pre-filled, can change |
| Start Time | ✅ Yes | When event begins |
| End Time | ✅ Yes | When event ends |
| Description | ❌ No | Additional details |
| Color | ✅ Yes | Choose from 7 colors |

4. Click **"Save Event"**
5. Event appears on calendar!

### Validation Rules
- End time must be **after** start time
- Title maximum **100 characters**
- Description maximum **500 characters**

---

## Editing Events

### How to Edit

1. **Click on any event** in the calendar
2. Event form opens with **existing data**
3. **Modify** any fields
4. Click **"Save Event"** to update

### What You Can Change
- ✏️ Event title
- 📅 Move to different date
- ⏰ Adjust start/end times
- 📝 Update description
- 🎨 Change color

---

## Deleting Events

### How to Delete

1. **Click on the event** to delete
2. Event form opens
3. Click **red "Delete Event"** button
4. Event removed from calendar

### Important Notes
- ⚠️ Deletion is **permanent**
- Event removed from database
- Cannot be undone

---

## Color Coding

### Available Colors

| Color | Name | Suggested Use |
|-------|------|---------------|
| 🔵 | Blue | Meetings (default) |
| 🟢 | Green | Completed tasks |
| 🟡 | Yellow | Important reminders |
| 🟠 | Orange | Urgent items |
| 🔴 | Red | Deadlines |
| 🟣 | Purple | Personal events |
| 🩷 | Pink | Social activities |

### Tips for Color Coding
- Use **same color** for similar event types
- **Red** for deadlines and urgent items
- **Green** for completed or positive events
- Create your own **color system**!

---

## Live Clock

The header displays a real-time clock:

- **12-hour format** (e.g., 2:30 PM)
- **Updates every second**
- Always visible while using app

---

## Data Synchronization

### How It Works
- Events save **automatically** to MongoDB
- **No manual save** required
- Changes sync **instantly**

### Requirements
- Internet connection required
- Backend server must be running

### If Server is Down
1. Error message will appear
2. Changes won't be saved
3. Check backend server is running
4. Restart server and try again

---

## Troubleshooting

### Events Not Appearing

**Problem:** Created event doesn't show up

**Solutions:**
1. ✅ Check backend server is running
2. ✅ Look at browser console for errors
3. ✅ Verify MongoDB connection
4. ✅ Refresh the page

---

### Cannot Save Events

**Problem:** "Failed to save event" error

**Solutions:**
1. ✅ Verify all required fields are filled
2. ✅ Check end time is after start time
3. ✅ Ensure title ≤ 100 characters
4. ✅ Check internet connection
5. ✅ Verify backend is accessible

---

### Calendar Not Loading

**Problem:** Blank screen or errors

**Solutions:**
1. ✅ Check browser console (F12)
2. ✅ Ensure backend runs on port 8000
3. ✅ Verify MongoDB connection string
4. ✅ Clear browser cache
5. ✅ Try different browser

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Esc** | Close modal forms |
| **F5** | Refresh calendar |
| **Ctrl/Cmd + F** | Search page |

---

## FAQ

**Q: Can I use this offline?**  
A: No, internet connection required for database sync.

**Q: How many events can I create?**  
A: Unlimited events stored in MongoDB.

**Q: Can I delete multiple events at once?**  
A: Not currently - delete events one at a time.

**Q: Does it work on mobile?**  
A: Optimized for desktop, mobile has limited functionality.

**Q: Can I print my calendar?**  
A: Use browser print function (Ctrl+P / Cmd+P).

**Q: Can multiple people use this?**  
A: Yes, but all share same event database.

---

## Tips for Best Experience

### Productivity Tips
1. 🎨 Use color coding **consistently**
2. 📊 Check **weekly view** for detailed planning
3. 📅 Use **monthly view** for big picture
4. 📝 Add **descriptions** for context
5. 🔄 **Update events** when plans change

### Best Practices
- Review your calendar **daily**
- Color code by **priority** or **category**
- Delete **old events** you don't need
- Use **meaningful titles** for quick scanning


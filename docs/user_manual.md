---
marp: true
theme: default
paginate: true
backgroundColor: #fff
backgroundImage: linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)
color: #fff
---

<style>
section {
  background: linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%);
  color: white;
  padding: 50px;
}
h1 {
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  border-bottom: 4px solid white;
  padding-bottom: 20px;
}
h2 {
  color: #DBEAFE;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}
ul, ol {
  font-size: 1.1em;
  line-height: 1.8;
}
strong {
  color: #FEF08A;
}
code {
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
}
</style>

# 📅 Calendar Application
## User Manual

**Version 1.0**
**Last Updated:** November 29, 2025

---

# 📖 Table of Contents

1. Introduction
2. Getting Started
3. Features Overview
4. Using Monthly View
5. Using Weekly View
6. Managing Events
7. Troubleshooting
8. FAQ

---

# 🎯 Introduction

## What is Calendar App?

A **modern, feature-rich calendar application** designed for efficient event management with:

- **Dual Views:** Monthly grid and Weekly columns
- **Cloud Storage:** Events saved to MongoDB database
- **Color Coding:** Organize events by category
- **Real-Time Clock:** Always know the current time
- **Desktop Optimized:** Best experience on larger screens

---

# 🚀 Getting Started

## System Requirements

- **Browser:** Chrome, Firefox, Edge, or Safari (latest version)
- **Screen:** 1024x768 minimum resolution
- **Internet:** Required for database sync
- **Backend:** FastAPI server running on localhost:8000

---

# 🚀 Getting Started

## First Launch

1. **Start the Backend Server**
   ```bash
   cd backend
   python -m uvicorn main:main --reload
   ```

2. **Open the Application**
   - Open `index.html` in your web browser
   - OR use Live Server extension in VS Code

3. **You're Ready!**
   - Calendar loads with current month
   - Live clock displays current time
   - Your events sync from the database

---

# ✨ Features Overview

## Main Features

1. **📅 Monthly View** - Traditional calendar grid
2. **📊 Weekly View** - Vertical day columns
3. **➕ Create Events** - Click any day to add events
4. **✏️ Edit Events** - Click events to modify
5. **🗑️ Delete Events** - Remove unwanted events
6. **🎨 Color Coding** - 7 color options
7. **⏰ Live Clock** - Current time display
8. **☁️ Cloud Sync** - MongoDB storage

---

# 📅 Using Monthly View

## Viewing the Calendar

- **Default view** when you open the app
- Shows **6 weeks** to display all days
- **Current day** highlighted in blue gradient
- **Previous/next month** days shown in gray

## Navigation

- **Previous** button: Go back one month
- **Next** button: Go forward one month
- **Today** button: Jump to current month

---

# 📅 Using Monthly View

## Understanding the Grid

- **7 columns** for days of the week (SUN-SAT)
- **Up to 6 rows** for weeks
- **Day number** in top-left corner
- **Events** listed below day number
- **Grayed days** are from adjacent months

---

# 📊 Using Weekly View

## Switching to Weekly View

1. Click **"Weekly"** button in top-right
2. Calendar switches to week view
3. Shows current week (SUN-SAT)

## Week View Features

- **7 vertical columns** (one per day)
- **Full day schedule** visible
- **Event times** displayed on each event
- **More space** for event details

---

# 📊 Using Weekly View

## Navigation in Week View

- **Previous:** Go back 7 days
- **Next:** Go forward 7 days
- **Today:** Jump to current week

## Tips

- Best for **detailed day planning**
- See **time conflicts** at a glance
- Great for **busy schedules**

---

# ➕ Creating Events

## How to Create an Event

1. **Click any day** in monthly or weekly view
2. **Event form opens** in a modal window
3. **Fill in details:**
   - **Title** (required) - Event name
   - **Date** (pre-filled) - Can change if needed
   - **Start Time** (required) - When event begins
   - **End Time** (required) - When event ends
   - **Description** (optional) - Additional details
   - **Color** (required) - Choose from 7 colors

---

# ➕ Creating Events

## Event Form Rules

- **Title:** 1-100 characters
- **Start/End Time:** HH:MM format (e.g., 09:30)
- **End time** must be **after** start time
- **Description:** Maximum 500 characters
- **Color:** Choose from color picker

## Saving

1. Click **"Save Event"** button
2. Event appears on calendar
3. Success message confirms save

---

# ✏️ Editing Events

## How to Edit an Event

1. **Click on any event** in the calendar
2. Event form opens with **existing data**
3. **Modify** any fields you want
4. Click **"Save Event"** to update

## What You Can Edit

- Change event title
- Move to different date
- Adjust start/end times
- Update description
- Change color

---

# 🗑️ Deleting Events

## How to Delete an Event

1. **Click on the event** you want to delete
2. Event form opens
3. Click **red "Delete Event"** button at bottom
4. **Confirm deletion**
5. Event removed from calendar and database

## Important Notes

- **Deletion is permanent**
- Event removed from cloud database
- Cannot be undone
- Success message confirms deletion

---

# 🎨 Color Coding

## Available Colors

Choose from **7 beautiful colors:**

1. **Blue** (#0EA5E9) - Default, meetings
2. **Green** (#10B981) - Completed tasks
3. **Yellow** (#F59E0B) - Important reminders
4. **Orange** (#F97316) - Urgent items
5. **Red** (#EF4444) - Deadlines
6. **Purple** (#8B5CF6) - Personal events
7. **Pink** (#EC4899) - Social activities

---

# 🎨 Color Coding

## Best Practices

- **Consistent categories** - Use same color for similar events
- **Priority levels** - Red for urgent, blue for normal
- **Work/Life balance** - Different colors for work vs personal
- **Visual scanning** - Quickly identify event types

---

# ⏰ Live Clock Feature

## What is it?

- **Real-time clock** in the header
- Shows **current time** in 12-hour format
- **Updates every second**
- Always visible while using the app

## Format

- **12-hour time** with AM/PM
- Example: `2:30 PM`
- Helps with scheduling and time awareness

---

# 🔄 Data Synchronization

## How Your Data is Saved

- **Automatic saving** to MongoDB cloud database
- **Real-time sync** when creating/editing/deleting
- **No manual save** required
- **Internet required** for sync

## What if Server is Down?

- Error message will appear
- Changes won't be saved
- Check that backend server is running
- Restart server and try again

---

# ⚠️ Troubleshooting

## Events Not Appearing

**Problem:** Created event doesn't show up

**Solutions:**
1. Check if backend server is running
2. Look at browser console for errors
3. Verify MongoDB connection
4. Refresh the page
5. Check correct date is selected

---

# ⚠️ Troubleshooting

## Cannot Save Events

**Problem:** "Failed to save event" error

**Solutions:**
1. Verify all required fields are filled
2. Check end time is after start time
3. Ensure title is 100 characters or less
4. Check internet connection
5. Verify backend API is accessible

---

# ⚠️ Troubleshooting

## Calendar Not Loading

**Problem:** Blank screen or errors on launch

**Solutions:**
1. Check browser console for errors
2. Ensure backend server is running on port 8000
3. Verify MongoDB connection string is correct
4. Clear browser cache
5. Try different browser

---

# ⚠️ Troubleshooting

## Time Format Issues

**Problem:** Time displays incorrectly

**Solutions:**
1. Enter times in HH:MM format (09:30, not 9:30am)
2. Use 24-hour format when entering (14:00 for 2pm)
3. Events display in format you entered
4. Check for typos in time fields

---

# ❓ FAQ

**Q: Can I use this offline?**
A: No, internet connection required for database sync.

**Q: How many events can I create?**
A: Unlimited events stored in MongoDB.

**Q: Can I delete multiple events at once?**
A: Not currently - delete events one at a time.

**Q: Does it work on mobile?**
A: Optimized for desktop, mobile may have limited functionality.

---

# ❓ FAQ

**Q: Can I print my calendar?**
A: Use browser print function (Ctrl+P / Cmd+P).

**Q: How do I backup my events?**
A: Events stored in MongoDB - configure database backups.

**Q: Can multiple people use this?**
A: Yes, but all share same event database.

**Q: What if I enter wrong time?**
A: Click event to edit and update the time.

---

# 📞 Support & Help

## Getting Help

- **Documentation:** Refer to this manual
- **Code Comments:** Extensive inline documentation
- **GitHub Repository:** Check README.md
- **Issues:** Report bugs on GitHub Issues page

## Contact Information

- **GitHub:** Jolteer/Calender
- **Repository:** github.com/Jolteer/Calender

---

# 🎓 Tips for Best Experience

## Productivity Tips

1. **Use color coding** consistently
2. **Check weekly view** for detailed planning
3. **Monthly view** for big picture overview
4. **Add descriptions** for important context
5. **Update events** promptly when plans change

## Keyboard Shortcuts

- **Ctrl+F / Cmd+F:** Search page (find event titles)
- **Refresh (F5):** Reload calendar
- **Esc:** Close modal forms

---

# 🎉 Conclusion

## You're All Set!

You now know how to:

✅ Navigate monthly and weekly views
✅ Create, edit, and delete events
✅ Use color coding effectively
✅ Troubleshoot common issues
✅ Understand data synchronization

**Start organizing your schedule today!**

---

# Thank You!

## Happy Scheduling! 📅✨

**Calendar Application v1.0**

*Built with HTML5, CSS3, JavaScript, Bootstrap 5, and MongoDB*

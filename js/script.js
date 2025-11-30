/**
 * Calendar Application
 * A feature-rich calendar with monthly and weekly views, event management, and MongoDB cloud storage.
 */
class Calendar {
    // Static constants for calendar configuration
    static MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    static MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    static DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    static API_URL = 'http://localhost:8000'; // FastAPI backend URL
    static STORAGE_KEY = 'calendarEvents'; // Kept for backwards compatibility
    static DEFAULT_EVENT_HOUR = 9;
    static DAYS_IN_WEEK = 7;
    static CELL_HEIGHT_MONTHLY = 120;
    static CELL_HEIGHT_WEEKLY = 600;

    /**
     * Initialize the calendar application
     */
    constructor() {
        this.currentDate = new Date(); // Current date being viewed
        this.currentView = 'month'; // Current view mode (month or week)
        this.events = []; // Events will be loaded from MongoDB
        this.eventModal = null; // Bootstrap modal instance
        this.elements = {}; // Cache for DOM elements
        this.init();
    }

    /**
     * Initialize the calendar after DOM is ready
     */
    async init() {
        this.cacheElements(); // Store references to DOM elements
        this.setupEventListeners(); // Attach event handlers
        await this.loadEvents(); // Load events from MongoDB
        this.renderMonthlyView(); // Render initial monthly view
        this.updateCurrentPeriod(); // Update the period display
        this.eventModal = new bootstrap.Modal(this.elements.eventModal); // Initialize modal
    }

    /**
     * Cache all DOM element references for better performance
     * Avoids repeated querySelector calls
     */
    cacheElements() {
        this.elements = {
            // View toggle buttons
            monthViewBtn: document.getElementById('monthViewBtn'),
            weekViewBtn: document.getElementById('weekViewBtn'),
            
            // Navigation buttons
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            todayBtn: document.getElementById('todayBtn'),
            
            // Event modal buttons
            saveEventBtn: document.getElementById('saveEventBtn'),
            deleteEventBtn: document.getElementById('deleteEventBtn'),
            
            // Display elements
            currentPeriod: document.getElementById('currentPeriod'),
            monthlyView: document.getElementById('monthlyView'),
            weeklyView: document.getElementById('weeklyView'),
            monthlyCalendarBody: document.getElementById('monthlyCalendarBody'),
            weeklyCalendarBody: document.getElementById('weeklyCalendarBody'),
            
            // Modal and form elements
            eventModal: document.getElementById('eventModal'),
            eventForm: document.getElementById('eventForm'),
            eventId: document.getElementById('eventId'),
            eventTitle: document.getElementById('eventTitle'),
            eventDate: document.getElementById('eventDate'),
            eventStartTime: document.getElementById('eventStartTime'),
            eventEndTime: document.getElementById('eventEndTime'),
            eventDescription: document.getElementById('eventDescription'),
            eventColor: document.getElementById('eventColor'),
            eventModalLabel: document.getElementById('eventModalLabel')
        };
    }

    /**
     * Load events from MongoDB via FastAPI backend
     * @returns {Promise<Array>} Array of event objects
     */
    async loadEvents() {
        try {
            const response = await fetch(`${Calendar.API_URL}/events`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.events = await response.json();
            return this.events;
        } catch (error) {
            console.error('Failed to load events from API:', error);
            alert('Unable to load events from server. Please check your connection.');
            return [];
        }
    }

    /**
     * Save events to MongoDB (deprecated - now saved directly via API calls)
     * Kept for compatibility but no longer used
     */
    saveEvents() {
        // Events are now saved directly to MongoDB via API calls
        // This method is kept for backwards compatibility but does nothing
    }

    /**
     * Set up all event listeners for user interactions
     */
    setupEventListeners() {
        // View switching
        this.elements.monthViewBtn.addEventListener('click', () => this.switchView('month'));
        this.elements.weekViewBtn.addEventListener('click', () => this.switchView('week'));
        
        // Navigation
        this.elements.prevBtn.addEventListener('click', () => this.navigate('prev'));
        this.elements.nextBtn.addEventListener('click', () => this.navigate('next'));
        this.elements.todayBtn.addEventListener('click', () => this.goToToday());
        
        // Event management
        this.elements.saveEventBtn.addEventListener('click', () => this.saveEvent());
        this.elements.deleteEventBtn.addEventListener('click', () => this.deleteEvent());
    }

    /**
     * Switch between monthly and weekly calendar views
     * @param {string} view - 'month' or 'week'
     */
    switchView(view) {
        this.currentView = view;
        const isMonthView = view === 'month';

        // Toggle view visibility
        this.elements.monthlyView.classList.toggle('d-none', !isMonthView);
        this.elements.weeklyView.classList.toggle('d-none', isMonthView);
        
        // Update active button states
        this.elements.monthViewBtn.classList.toggle('active', isMonthView);
        this.elements.weekViewBtn.classList.toggle('active', !isMonthView);

        // Render appropriate view
        isMonthView ? this.renderMonthlyView() : this.renderWeeklyView();
        this.updateCurrentPeriod();
    }

    /**
     * Navigate to previous or next period
     * @param {string} direction - 'prev' or 'next'
     */
    navigate(direction) {
        const delta = direction === 'prev' ? -1 : 1;
        
        if (this.currentView === 'month') {
            // Navigate months
            this.currentDate.setMonth(this.currentDate.getMonth() + delta);
            this.renderMonthlyView();
        } else {
            // Navigate weeks (7 days at a time)
            this.currentDate.setDate(this.currentDate.getDate() + (delta * 7));
            this.renderWeeklyView();
        }
        this.updateCurrentPeriod();
    }

    /**
     * Jump to today's date
     */
    goToToday() {
        this.currentDate = new Date();
        this.currentView === 'month' ? this.renderMonthlyView() : this.renderWeeklyView();
        this.updateCurrentPeriod();
    }

    /**
     * Update the displayed period text (e.g., "November 2025" or "Nov 10 - Nov 16")
     */
    updateCurrentPeriod() {
        if (this.currentView === 'month') {
            // Display month and year for monthly view
            const month = Calendar.MONTH_NAMES[this.currentDate.getMonth()];
            const year = this.currentDate.getFullYear();
            this.elements.currentPeriod.textContent = `${month} ${year}`;
        } else {
            // Display week range for weekly view
            const weekStart = this.getWeekStart(this.currentDate);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            this.elements.currentPeriod.textContent = 
                `${this.formatDateShort(weekStart)} - ${this.formatDateShort(weekEnd)}`;
        }
    }

    /**
     * Format a date in short form (e.g., "Nov 10, 2025")
     * @param {Date} date - Date to format
     * @returns {string} Formatted date string
     */
    formatDateShort(date) {
        const month = Calendar.MONTH_NAMES_SHORT[date.getMonth()];
        return `${month} ${date.getDate()}, ${date.getFullYear()}`;
    }

    /**
     * Format a date as YYYY-MM-DD string
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @param {number} day - Day of month
     * @returns {string} Formatted date string
     */
    formatDateString(year, month, day) {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    /**
     * Convert 24-hour time to 12-hour AM/PM format
     * @param {string} time24 - Time in HH:MM format (24-hour)
     * @returns {string} Time in 12-hour AM/PM format
     */
    convertTo12Hour(time24) {
        const [hours24, minutes] = time24.split(':').map(Number);
        const period = hours24 >= 12 ? 'PM' : 'AM';
        let hours12 = hours24 % 12;
        hours12 = hours12 || 12; // Convert 0 to 12
        return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
    }

    /**
     * Render the monthly calendar view
     */
    renderMonthlyView() {
        const { year, month, firstDayOfWeek, lastDate, prevLastDate, today, isCurrentMonth, todayDate } = 
            this.getMonthData();

        const totalCells = firstDayOfWeek + lastDate;
        const rows = Math.ceil(totalCells / 7); // Calculate number of weeks to display
        let html = '';
        let day = 1; // Current month day counter
        let nextMonthDay = 1; // Next month day counter

        // Build calendar grid
        for (let i = 0; i < rows; i++) {
            html += '<tr>';
            for (let j = 0; j < 7; j++) {
                const cellIndex = i * 7 + j;
                
                if (cellIndex < firstDayOfWeek) {
                    // Previous month days
                    html += this.createMonthCell('prev', prevLastDate - firstDayOfWeek + cellIndex + 1, year, month);
                } else if (day <= lastDate) {
                    // Current month days
                    const isToday = isCurrentMonth && day === todayDate;
                    html += this.createMonthCell('current', day, year, month, isToday);
                    day++;
                } else {
                    // Next month days
                    html += this.createMonthCell('next', nextMonthDay, year, month);
                    nextMonthDay++;
                }
            }
            html += '</tr>';
        }

        this.elements.monthlyCalendarBody.innerHTML = html;
        this.attachMonthCellListeners(); // Add click handlers to cells
        this.renderEventsInMonthlyView(); // Display events on calendar
    }

    /**
     * Get all data needed for rendering the current month
     * @returns {Object} Month data including year, month, day counts, etc.
     */
    getMonthData() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1); // First day of month
        const lastDay = new Date(year, month + 1, 0); // Last day of month
        const prevLastDay = new Date(year, month, 0); // Last day of previous month
        const today = new Date();
        
        return {
            year,
            month,
            firstDayOfWeek: firstDay.getDay(), // 0-6 (Sun-Sat)
            lastDate: lastDay.getDate(), // Number of days in month
            prevLastDate: prevLastDay.getDate(), // Number of days in previous month
            today,
            isCurrentMonth: today.getMonth() === month && today.getFullYear() === year,
            todayDate: today.getDate()
        };
    }

    /**
     * Create HTML for a single month calendar cell
     * @param {string} type - 'prev', 'current', or 'next' month
     * @param {number} day - Day number
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @param {boolean} isToday - Whether this is today's date
     * @returns {string} HTML string for the cell
     */
    createMonthCell(type, day, year, month, isToday = false) {
        let actualMonth = month;
        let actualYear = year;
        
        // Adjust month/year for prev/next month cells
        if (type === 'prev') {
            actualMonth = month === 0 ? 11 : month - 1;
            actualYear = month === 0 ? year - 1 : year;
        } else if (type === 'next') {
            actualMonth = month === 11 ? 0 : month + 1;
            actualYear = month === 11 ? year + 1 : year;
        }
        
        const dateStr = this.formatDateString(actualYear, actualMonth, day);
        const classes = type !== 'current' ? 'other-month' : (isToday ? 'today' : '');
        
        return `<td class="${classes}" data-date="${dateStr}">
            <div class="day-number">${day}</div>
            <div class="events-container"></div>
        </td>`;
    }

    /**
     * Attach click event listeners to all month view cells
     */
    attachMonthCellListeners() {
        document.querySelectorAll('.monthly-calendar td').forEach(cell => {
            cell.addEventListener('click', (e) => {
                // Only open modal if not clicking on an event
                if (!e.target.closest('.event-item')) {
                    this.openEventModal(cell.dataset.date);
                }
            });
        });
    }

    /**
     * Get the start date (Sunday) of the week containing the given date
     * @param {Date} date - Any date in the week
     * @returns {Date} Sunday of that week
     */
    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        d.setDate(diff);
        this.normalizeDate(d);
        return d;
    }

    /**
     * Normalize date to midnight to avoid timezone issues
     * @param {Date} date - Date to normalize
     */
    normalizeDate(date) {
        date.setHours(0, 0, 0, 0);
    }

    /**
     * Render the weekly calendar view
     */
    renderWeeklyView() {
        const weekStart = this.getWeekStart(this.currentDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        this.updateWeeklyHeaders(weekStart, today); // Update day headers
        this.elements.weeklyCalendarBody.innerHTML = this.generateWeeklyGrid(weekStart, today);
        this.attachWeeklyCellListeners(); // Add click handlers
        this.renderEventsInWeeklyView(); // Display events
    }

    /**
     * Update the header row of the weekly view with day names and dates
     * @param {Date} weekStart - Sunday of the week
     * @param {Date} today - Today's date
     */
    updateWeeklyHeaders(weekStart, today) {
        const headerIds = ['sun-header', 'mon-header', 'tue-header', 'wed-header', 
                          'thu-header', 'fri-header', 'sat-header'];
        
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(weekStart);
            currentDay.setDate(currentDay.getDate() + i);
            const isToday = currentDay.getTime() === today.getTime();
            const headerClass = isToday ? 'current-day-header' : '';
            
            // Display day name and date
            const header = document.getElementById(headerIds[i]);
            header.innerHTML = '';
            
            const headerDiv = document.createElement('div');
            headerDiv.className = `day-header ${headerClass}`;
            
            const nameDiv = document.createElement('div');
            nameDiv.className = 'day-name';
            nameDiv.textContent = Calendar.DAY_NAMES[i];
            
            const dateDiv = document.createElement('div');
            dateDiv.className = 'day-date';
            dateDiv.textContent = currentDay.getDate();
            
            headerDiv.appendChild(nameDiv);
            headerDiv.appendChild(dateDiv);
            header.appendChild(headerDiv);
        }
    }

    /**
     * Generate HTML for the weekly view grid (7 columns for days)
     * @param {Date} weekStart - Sunday of the week
     * @param {Date} today - Today's date
     * @returns {string} HTML for the weekly grid
     */
    generateWeeklyGrid(weekStart, today) {
        let html = '<tr>';
        
        for (let day = 0; day < 7; day++) {
            const currentDay = new Date(weekStart);
            currentDay.setDate(currentDay.getDate() + day);
            const isToday = currentDay.getTime() === today.getTime();
            const todayClass = isToday ? 'weekly-today' : '';
            const dateStr = currentDay.toISOString().split('T')[0];
            html += `<td class="weekly-day-cell ${todayClass}" data-date="${dateStr}"></td>`;
        }
        
        return html + '</tr>';
    }

    /**
     * Attach click event listeners to all weekly view cells
     */
    attachWeeklyCellListeners() {
        document.querySelectorAll('.weekly-day-cell').forEach(cell => {
            cell.addEventListener('click', (e) => {
                // Only open modal if not clicking on an event
                if (!e.target.closest('.event-item-weekly')) {
                    this.openEventModal(cell.dataset.date, Calendar.DEFAULT_EVENT_HOUR);
                }
            });
        });
    }

    /**
     * Render events in the monthly calendar view
     */
    renderEventsInMonthlyView() {
        // Group events by date for efficient rendering
        const eventsByDate = this.groupEventsByDate();
        
        Object.entries(eventsByDate).forEach(([date, events]) => {
            const cell = document.querySelector(`.monthly-calendar td[data-date="${date}"]`);
            if (!cell) return;
            
            const container = cell.querySelector('.events-container');
            const fragment = document.createDocumentFragment();
            
            events.forEach(event => {
                const eventDiv = this.createEventElement(event, 'event-item');
                eventDiv.textContent = this.sanitizeHTML(event.title);
                fragment.appendChild(eventDiv);
            });
            
            container.appendChild(fragment);
        });
    }

    /**
     * Render events in the weekly calendar view
     * Events are stacked vertically within each day column
     */
    renderEventsInWeeklyView() {
        const eventsByDate = this.groupEventsByDate();
        
        Object.entries(eventsByDate).forEach(([date, events]) => {
            const cell = document.querySelector(`.weekly-day-cell[data-date="${date}"]`);
            if (!cell) return;

            cell.style.position = 'relative';
            
            events.forEach((event, index) => {
                const eventDiv = this.createEventElement(event, 'event-item-weekly');
                
                // Stack events from top with minimal spacing
                eventDiv.style.position = 'relative';
                eventDiv.style.marginTop = index === 0 ? '8px' : '4px';
                eventDiv.style.marginLeft = '8px';
                eventDiv.style.marginRight = '8px';
                eventDiv.style.zIndex = `${10 + index}`;
                
                // Build event content with title, time, and optional description (sanitized)
                const titleEl = document.createElement('strong');
                titleEl.textContent = event.title;
                
                const timeEl = document.createElement('small');
                const startTime12 = this.convertTo12Hour(event.startTime);
                const endTime12 = this.convertTo12Hour(event.endTime);
                timeEl.textContent = `${startTime12} - ${endTime12}`;
                
                eventDiv.appendChild(titleEl);
                eventDiv.appendChild(document.createElement('br'));
                eventDiv.appendChild(timeEl);
                
                if (event.description?.trim()) {
                    const descEl = document.createElement('span');
                    descEl.className = 'event-description';
                    descEl.textContent = event.description;
                    eventDiv.appendChild(document.createElement('br'));
                    eventDiv.appendChild(descEl);
                }
                
                cell.appendChild(eventDiv);
            });
        });
    }

    /**
     * Group events by date and sort them by start time
     * @returns {Object} Object with dates as keys and sorted event arrays as values
     */
    groupEventsByDate() {
        const eventsByDate = {};
        
        // Group events by date
        this.events.forEach(event => {
            if (!eventsByDate[event.date]) {
                eventsByDate[event.date] = [];
            }
            eventsByDate[event.date].push(event);
        });

        // Sort events by start time within each date
        Object.keys(eventsByDate).forEach(date => {
            eventsByDate[date].sort((a, b) => {
                const [hourA, minA] = a.startTime.split(':').map(Number);
                const [hourB, minB] = b.startTime.split(':').map(Number);
                return (hourA * 60 + minA) - (hourB * 60 + minB);
            });
        });

        return eventsByDate;
    }

    /**
     * Create a DOM element for an event
     * @param {Object} event - Event data object
     * @param {string} className - CSS class for the element
     * @returns {HTMLElement} Event DOM element
     */
    createEventElement(event, className) {
        const eventDiv = document.createElement('div');
        eventDiv.className = className;
        eventDiv.style.backgroundColor = event.color;
        eventDiv.dataset.eventId = event.id;
        
        // Click to edit event
        eventDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            this.editEvent(event.id);
        });
        
        return eventDiv;
    }

    /**
     * Open the event modal to create a new event
     * @param {string} date - Date in YYYY-MM-DD format
     * @param {number|null} hour - Optional default hour (0-23)
     */
    openEventModal(date, hour = null) {
        this.elements.eventForm.reset();
        this.elements.eventId.value = '';
        this.elements.eventDate.value = date;
        
        // Set default time if provided
        if (hour !== null) {
            this.elements.eventStartTime.value = `${String(hour).padStart(2, '0')}:00`;
            this.elements.eventEndTime.value = `${String(hour + 1).padStart(2, '0')}:00`;
        }
        
        this.elements.eventModalLabel.textContent = 'Add Event';
        this.elements.deleteEventBtn.style.display = 'none'; // Hide delete for new events
        this.eventModal.show();
    }

    /**
     * Open the event modal to edit an existing event
     * @param {string} eventId - ID of the event to edit
     */
    editEvent(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return;

        // Populate form with event data
        this.elements.eventId.value = event.id;
        this.elements.eventTitle.value = event.title;
        this.elements.eventDate.value = event.date;
        this.elements.eventStartTime.value = event.startTime;
        this.elements.eventEndTime.value = event.endTime;
        this.elements.eventDescription.value = event.description || '';
        this.elements.eventColor.value = event.color;
        
        this.elements.eventModalLabel.textContent = 'Edit Event';
        this.elements.deleteEventBtn.style.display = 'block'; // Show delete for existing events
        this.eventModal.show();
    }

    /**
     * Save a new or updated event
     */
    async saveEvent() {
        // Collect form data
        const eventData = {
            id: this.elements.eventId.value,
            title: this.elements.eventTitle.value,
            date: this.elements.eventDate.value,
            startTime: this.elements.eventStartTime.value,
            endTime: this.elements.eventEndTime.value,
            description: this.elements.eventDescription.value,
            color: this.elements.eventColor.value
        };

        // Validate required fields
        if (!this.validateEventData(eventData)) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            // Update existing or create new event
            if (eventData.id) {
                await this.updateExistingEvent(eventData);
            } else {
                await this.createNewEvent(eventData);
            }

            await this.loadEvents(); // Reload events from API
            this.eventModal.hide();
            this.refreshCurrentView(); // Re-render calendar
        } catch (error) {
            console.error('Failed to save event:', error);
            alert('Failed to save event. Please try again.');
        }
    }

    /**
     * Validate event data
     * @param {Object} data - Event data to validate
     * @returns {boolean} True if valid
     */
    validateEventData(data) {
        if (!data.title?.trim() || !data.date || !data.startTime || !data.endTime) {
            return false;
        }
        
        // Validate date format (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(data.date)) {
            return false;
        }
        
        // Validate time format (HH:MM)
        const timeRegex = /^\d{2}:\d{2}$/;
        if (!timeRegex.test(data.startTime) || !timeRegex.test(data.endTime)) {
            return false;
        }
        
        return true;
    }

    /**
     * Sanitize HTML to prevent XSS attacks
     * @param {string} text - Text to sanitize
     * @returns {string} Sanitized text
     */
    sanitizeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Update an existing event in MongoDB via API
     * @param {Object} eventData - Updated event data
     */
    async updateExistingEvent(eventData) {
        try {
            const response = await fetch(`${Calendar.API_URL}/events/${eventData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to update event:', error);
            throw error;
        }
    }

    /**
     * Create a new event in MongoDB via API
     * @param {Object} eventData - New event data
     */
    async createNewEvent(eventData) {
        try {
            const response = await fetch(`${Calendar.API_URL}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Failed to create event:', error);
            throw error;
        }
    }

    /**
     * Delete an event from MongoDB via API
     */
    async deleteEvent() {
        const eventId = this.elements.eventId.value;
        if (!eventId) return;

        if (confirm('Are you sure you want to delete this event?')) {
            try {
                const response = await fetch(`${Calendar.API_URL}/events/${eventId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                await this.loadEvents(); // Reload events from API
                this.eventModal.hide();
                this.refreshCurrentView();
            } catch (error) {
                console.error('Failed to delete event:', error);
                alert('Failed to delete event. Please try again.');
            }
        }
    }

    /**
     * Re-render the current view (month or week)
     */
    refreshCurrentView() {
        this.currentView === 'month' ? this.renderMonthlyView() : this.renderWeeklyView();
    }
}

/**
 * Live Clock - Updates every second to show current time
 */
function updateClock() {
    const clockElement = document.getElementById('liveClock');
    if (clockElement) {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        // Convert to 12-hour format with AM/PM
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 should be 12
        const hoursStr = hours.toString().padStart(2, '0');
        
        clockElement.textContent = `${hoursStr}:${minutes}:${seconds} ${ampm}`;
    }
}

// Initialize calendar when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calendar();
    
    // Start the live clock
    updateClock(); // Update immediately
    setInterval(updateClock, 1000); // Update every second
});

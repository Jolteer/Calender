/**
 * =====================================================
 * CALENDAR APPLICATION - JavaScript Frontend
 * =====================================================
 * A feature-rich calendar with monthly and weekly views, event management,
 * and MongoDB cloud storage integration via FastAPI backend.
 * 
 * Key Features:
 * - Monthly and weekly calendar views with smooth transitions
 * - Full CRUD operations for events (Create, Read, Update, Delete)
 * - Color-coded events with drag-and-drop support
 * - Form validation with detailed error messages
 * - API retry logic for resilience
 * - Toast notifications for user feedback
 * - Optimized rendering with DOM caching
 */

// =====================================================
// CUSTOM ERROR CLASSES
// =====================================================
/**
 * Base error class for calendar-specific errors
 * Extends JavaScript's built-in Error class to add context
 */
class CalendarError extends Error {
    constructor(message, originalError = null) {
        super(message);
        this.name = 'CalendarError';
        this.originalError = originalError; // Store original error for debugging
    }
}

/**
 * API-specific error class
 * Thrown when HTTP requests fail, includes status code for error handling
 */
class APIError extends CalendarError {
    constructor(message, statusCode = null, originalError = null) {
        super(message, originalError);
        this.name = 'APIError';
        this.statusCode = statusCode; // HTTP status code (400, 404, 500, etc.)
    }
}

/**
 * Validation error class
 * Thrown when user input fails validation rules
 */
class ValidationError extends CalendarError {
    constructor(message, field = null) {
        super(message);
        this.name = 'ValidationError';
        this.field = field; // Name of the field that failed validation
    }
}

// =====================================================
// API CLIENT UTILITY
// =====================================================
/**
 * Utility class for making HTTP requests with automatic retry logic
 * 
 * Implements exponential backoff for failed requests to handle:
 * - Temporary network issues
 * - Server errors (5xx status codes)
 * - Connection timeouts
 */
class APIClient {
    // Retry configuration constants
    static MAX_RETRIES = 3;         // Number of times to retry a failed request
    static RETRY_DELAY = 1000;      // Base delay in milliseconds (1 second)
    
    /**
     * Fetch with automatic retry logic for failed requests
     * 
     * This method will retry requests that fail due to:
     * - Network errors (TypeError from fetch)
     * - Server errors (5xx status codes)
     * 
     * It will NOT retry:
     * - Client errors (4xx status codes like 400, 404)
     * - Successful responses (2xx status codes)
     * 
     * @param {string} url - URL to fetch from
     * @param {Object} options - Fetch API options (method, headers, body, etc.)
     * @param {number} retries - Number of retries remaining (internal use)
     * @returns {Promise<Response>} Fetch API Response object
     * @throws {APIError} If request fails after all retries
     * @throws {TypeError} If network error occurs after all retries
     */
    static async fetchWithRetry(url, options = {}, retries = APIClient.MAX_RETRIES) {
        try {
            // Attempt the HTTP request
            const response = await fetch(url, options);
            
            // Check if response was successful (status 200-299)
            if (!response.ok) {
                // Try to parse error details from response body
                const errorData = await response.json().catch(() => ({}));
                
                // Throw APIError with status code and error message
                throw new APIError(
                    errorData.detail || `HTTP error! status: ${response.status}`,
                    response.status
                );
            }
            
            return response;
            
        } catch (error) {
            // Determine if we should retry this request
            const shouldRetry = retries > 0 && (
                error instanceof TypeError ||  // Network error (connection failed, DNS lookup failed, etc.)
                (error instanceof APIError && error.statusCode >= 500)  // Server error (database down, timeout, etc.)
            );
            
            if (shouldRetry) {
                // Log retry attempt for debugging
                console.warn(`Request failed, retrying... (${retries} attempts left)`);
                
                // Wait before retrying (prevents overwhelming the server)
                await new Promise(resolve => setTimeout(resolve, APIClient.RETRY_DELAY));
                
                // Recursively retry with decremented retry counter
                return APIClient.fetchWithRetry(url, options, retries - 1);
            }
            
            // No more retries or non-retryable error - throw it
            throw error;
        }
    }
}

// =====================================================
// CALENDAR CLASS - MAIN APPLICATION LOGIC
// =====================================================

class Calendar {
    // =====================================================
    // STATIC CONSTANTS - Configuration values used throughout the app
    // =====================================================
    
    // Month and day names for display
    static MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    static MONTH_NAMES_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    static DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    
    // API configuration
    static API_URL = 'http://localhost:8000';  // FastAPI backend URL
    static STORAGE_KEY = 'calendarEvents';      // Kept for backwards compatibility (not used with MongoDB)
    
    // Default event settings
    static DEFAULT_EVENT_HOUR = 9;              // Default start time when creating events (9:00 AM)
    static DEFAULT_EVENT_DURATION = 1;          // Default event duration in hours
    
    // Calendar layout constants
    static DAYS_IN_WEEK = 7;                    // Number of days in a week
    static CELL_HEIGHT_MONTHLY = 120;           // Height of calendar cells in monthly view (px)
    static CELL_HEIGHT_WEEKLY = 600;            // Height of calendar cells in weekly view (px)
    static CALENDAR_WEEKS_MIN = 0;              // Minimum weeks to display
    static CALENDAR_WEEKS_MAX = 6;              // Maximum weeks to display (to fit all days)
    
    // Time formatting constants
    static TIME_FORMAT_24H = 24;                // 24-hour time format
    static TIME_FORMAT_12H = 12;                // 12-hour time format
    static MINUTES_PER_HOUR = 60;               // Minutes in an hour
    static PAD_LENGTH = 2;                      // Zero-padding length for time strings
    static PAD_CHAR = '0';                      // Character used for padding
    
    // Event color palette - predefined colors for events
    static EVENT_COLORS = {
        BLUE: '#0EA5E9',
        GREEN: '#10B981',
        YELLOW: '#F59E0B',
        ORANGE: '#F97316',
        RED: '#EF4444',
        PURPLE: '#8B5CF6',
        PINK: '#EC4899'
    };
    static DEFAULT_EVENT_COLOR = Calendar.EVENT_COLORS.BLUE;
    
    // View types enumeration
    static VIEW_TYPES = {
        MONTH: 'month',
        WEEK: 'week'
    };
    
    // Navigation direction enumeration
    static NAV_DIRECTIONS = {
        PREV: 'prev',
        NEXT: 'next'
    };
    
    // Month cell types - used to style cells from previous/next months
    static CELL_TYPES = {
        PREV: 'prev',      // Days from previous month
        CURRENT: 'current', // Days from current month
        NEXT: 'next'       // Days from next month
    };
    
    // HTTP method enumeration for API calls
    static HTTP_METHODS = {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        DELETE: 'DELETE'
    };
    
    // API endpoints - centralized endpoint definitions
    static API_ENDPOINTS = {
        EVENTS: '/events',                      // GET all events, POST new event
        EVENT_BY_ID: (id) => `/events/${id}`   // PUT or DELETE specific event
    };

    /**
     * Constructor - Initialize the calendar application
     * 
     * Sets up initial state and kicks off the initialization process.
     * Called automatically when creating a new Calendar instance.
     */
    constructor() {
        this.currentDate = new Date();      // Date currently being viewed (defaults to today)
        this.currentView = 'month';         // Current view mode ('month' or 'week')
        this.events = [];                   // Array to store all calendar events (loaded from MongoDB)
        this.eventModal = null;             // Bootstrap modal instance (initialized after DOM ready)
        this.elements = {};                 // Cache for DOM element references (populated in cacheElements)
        this.init();                        // Start initialization process
    }

    /**
     * Initialize the calendar after DOM is ready
     * 
     * This async method performs all setup tasks in the correct order:
     * 1. Cache DOM elements for performance
     * 2. Attach event listeners
     * 3. Load events from database
     * 4. Render initial view
     * 5. Initialize modal
     */
    async init() {
        this.cacheElements();           // Store references to frequently-accessed DOM elements
        this.setupEventListeners();     // Attach click handlers, form submissions, etc.
        await this.loadEvents();        // Fetch events from MongoDB via FastAPI
        this.renderMonthlyView();       // Display calendar in monthly view
        this.updateCurrentPeriod();     // Update the "Month Year" header
        this.eventModal = new bootstrap.Modal(this.elements.eventModal); // Create Bootstrap modal
    }

    /**
     * Cache all DOM element references for better performance
     * 
     * Storing references prevents repeated querySelector calls, which improves
     * performance especially during frequent operations like rendering.
     * 
     * Elements are organized by category:
     * - View toggle buttons (month/week)
     * - Navigation buttons (prev/next/today)
     * - Event modal buttons (save/delete)
     * - Display elements (calendar containers, forms, etc.)
     */
    cacheElements() {
        this.elements = {
            // View toggle buttons - switch between month and week views
            monthViewBtn: document.getElementById('monthViewBtn'),
            weekViewBtn: document.getElementById('weekViewBtn'),
            
            // Navigation buttons - move through time periods
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            todayBtn: document.getElementById('todayBtn'),
            
            // Event modal action buttons
            saveEventBtn: document.getElementById('saveEventBtn'),
            deleteEventBtn: document.getElementById('deleteEventBtn'),
            
            // Display elements
            currentPeriod: document.getElementById('currentPeriod'),  // Header showing current month/week
            monthlyView: document.getElementById('monthlyView'),      // Monthly calendar container
            weeklyView: document.getElementById('weeklyView'),                // Weekly calendar container
            monthlyCalendarBody: document.getElementById('monthlyCalendarBody'),  // Monthly grid tbody
            weeklyCalendarBody: document.getElementById('weeklyCalendarBody'),    // Weekly grid tbody
            
            // Modal and form elements - used for creating/editing events
            eventModal: document.getElementById('eventModal'),                    // Bootstrap modal element
            eventForm: document.getElementById('eventForm'),                      // Form element
            eventId: document.getElementById('eventId'),                          // Hidden field storing event ID
            eventTitle: document.getElementById('eventTitle'),                    // Title input
            eventDate: document.getElementById('eventDate'),                      // Date input
            eventStartTime: document.getElementById('eventStartTime'),            // Start time input
            eventEndTime: document.getElementById('eventEndTime'),                // End time input
            eventDescription: document.getElementById('eventDescription'),        // Description textarea
            eventColor: document.getElementById('eventColor'),                    // Color picker
            eventModalLabel: document.getElementById('eventModalLabel')           // Modal title
        };
    }

    /**
     * Load events from MongoDB via FastAPI backend
     * 
     * Fetches all events from the API and stores them in this.events array.
     * Uses retry logic to handle temporary network issues.
     * 
     * @returns {Promise<Array>} Array of event objects from the database
     */
    async loadEvents() {
        try {
            // Build full API URL
            const url = `${Calendar.API_URL}${Calendar.API_ENDPOINTS.EVENTS}`;
            
            // Fetch with automatic retry on failure
            const response = await APIClient.fetchWithRetry(url);
            
            // Parse JSON response and store events
            this.events = await response.json();
            return this.events;
            
        } catch (error) {
            // Log error for debugging
            console.error('Failed to load events from API:', error);
            
            // Show user-friendly error message based on error type
            if (error instanceof APIError) {
                if (error.statusCode === 404) {
                    this.showError('Events not found. Please check your server configuration.');
                } else if (error.statusCode >= 500) {
                    this.showError('Server error. Please try again later.');
                } else {
                    this.showError(`Failed to load events: ${error.message}`);
                }
            } else {
                // Network error (backend not running, no internet, etc.)
                this.showError('Unable to connect to server. Please check your connection and ensure the backend is running.');
            }
            
            // Return empty array so calendar can still render
            return [];
        }
    }

    /**
     * Save events to storage (deprecated - now using MongoDB API)
     * 
     * Previously used localStorage to save events client-side.
     * Now events are saved directly to MongoDB via API calls when
     * creating/updating/deleting events.
     * 
     * Kept for backwards compatibility but no longer used.
     */
    saveEvents() {
        // Events are now saved directly to MongoDB via API calls
        // This method is kept for backwards compatibility but does nothing
    }

    /**
     * Set up all event listeners for user interactions
     * 
     * Attaches click handlers and form submissions to enable:
     * - View switching (month/week)
     * - Navigation (prev/next/today)
     * - Event management (save/delete)
     * - Form submission
     */
    setupEventListeners() {
        // View switching buttons
        this.elements.monthViewBtn.addEventListener('click', () => this.switchView('month'));
        this.elements.weekViewBtn.addEventListener('click', () => this.switchView('week'));
        
        // Navigation buttons
        this.elements.prevBtn.addEventListener('click', () => this.navigate('prev'));
        this.elements.nextBtn.addEventListener('click', () => this.navigate('next'));
        this.elements.todayBtn.addEventListener('click', () => this.goToToday());
        
        // Event management buttons
        this.elements.saveEventBtn.addEventListener('click', () => this.saveEvent());
        this.elements.deleteEventBtn.addEventListener('click', () => this.deleteEvent());
    }

    /**
     * Switch between monthly and weekly calendar views
     * @param {string} view - 'month' or 'week'
     */
    switchView(view) {
        this.currentView = view;
        const isMonthView = view === Calendar.VIEW_TYPES.MONTH;

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
        const delta = direction === Calendar.NAV_DIRECTIONS.PREV ? -1 : 1;
        
        if (this.currentView === Calendar.VIEW_TYPES.MONTH) {
            this.currentDate.setMonth(this.currentDate.getMonth() + delta);
            this.renderMonthlyView();
        } else {
            this.currentDate.setDate(this.currentDate.getDate() + (delta * Calendar.DAYS_IN_WEEK));
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
        if (this.currentView === Calendar.VIEW_TYPES.MONTH) {
            const month = Calendar.MONTH_NAMES[this.currentDate.getMonth()];
            const year = this.currentDate.getFullYear();
            this.elements.currentPeriod.textContent = `${month} ${year}`;
        } else {
            const weekStart = this.getWeekStart(this.currentDate);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + (Calendar.DAYS_IN_WEEK - 1));
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
        const paddedMonth = String(month + 1).padStart(Calendar.PAD_LENGTH, Calendar.PAD_CHAR);
        const paddedDay = String(day).padStart(Calendar.PAD_LENGTH, Calendar.PAD_CHAR);
        return `${year}-${paddedMonth}-${paddedDay}`;
    }

    /**
     * Convert 24-hour time to 12-hour AM/PM format
     * @param {string} time24 - Time in HH:MM format (24-hour)
     * @returns {string} Time in 12-hour AM/PM format
     */
    convertTo12Hour(time24) {
        const [hours24, minutes] = time24.split(':').map(Number);
        const period = hours24 >= Calendar.TIME_FORMAT_12H ? 'PM' : 'AM';
        let hours12 = hours24 % Calendar.TIME_FORMAT_12H;
        hours12 = hours12 || Calendar.TIME_FORMAT_12H; // Convert 0 to 12
        return `${hours12}:${String(minutes).padStart(Calendar.PAD_LENGTH, Calendar.PAD_CHAR)} ${period}`;
    }

    /**
     * Render the monthly calendar view
     */
    renderMonthlyView() {
        const { year, month, firstDayOfWeek, lastDate, prevLastDate, today, isCurrentMonth, todayDate } = 
            this.getMonthData();

        const totalCells = firstDayOfWeek + lastDate;
        const weekRows = Math.ceil(totalCells / Calendar.DAYS_IN_WEEK);
        let html = '';
        let currentMonthDay = 1;
        let nextMonthDay = 1;

        // Build calendar grid
        for (let weekIndex = 0; weekIndex < weekRows; weekIndex++) {
            html += '<tr>';
            for (let dayIndex = 0; dayIndex < Calendar.DAYS_IN_WEEK; dayIndex++) {
                const cellIndex = weekIndex * Calendar.DAYS_IN_WEEK + dayIndex;
                
                if (cellIndex < firstDayOfWeek) {
                    // Previous month days
                    const prevMonthDay = prevLastDate - firstDayOfWeek + cellIndex + 1;
                    html += this.createMonthCell(Calendar.CELL_TYPES.PREV, prevMonthDay, year, month);
                } else if (currentMonthDay <= lastDate) {
                    // Current month days
                    const isToday = isCurrentMonth && currentMonthDay === todayDate;
                    html += this.createMonthCell(Calendar.CELL_TYPES.CURRENT, currentMonthDay, year, month, isToday);
                    currentMonthDay++;
                } else {
                    // Next month days
                    html += this.createMonthCell(Calendar.CELL_TYPES.NEXT, nextMonthDay, year, month);
                    nextMonthDay++;
                }
            }
            html += '</tr>';
        }

        this.elements.monthlyCalendarBody.innerHTML = html;
        this.attachMonthCellListeners();
        this.renderEventsInMonthlyView();
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
        const { actualMonth, actualYear } = this.calculateActualMonthYear(type, month, year);
        const dateStr = this.formatDateString(actualYear, actualMonth, day);
        const classes = this.getCellClasses(type, isToday);
        
        return `<td class="${classes}" data-date="${dateStr}">
            <div class="day-number">${day}</div>
            <div class="events-container"></div>
        </td>`;
    }
    
    /**
     * Calculate the actual month and year for prev/next month cells
     * @param {string} type - Cell type (prev, current, next)
     * @param {number} month - Current month (0-11)
     * @param {number} year - Current year
     * @returns {Object} Object with actualMonth and actualYear
     */
    calculateActualMonthYear(type, month, year) {
        let actualMonth = month;
        let actualYear = year;
        
        if (type === Calendar.CELL_TYPES.PREV) {
            actualMonth = month === 0 ? 11 : month - 1;
            actualYear = month === 0 ? year - 1 : year;
        } else if (type === Calendar.CELL_TYPES.NEXT) {
            actualMonth = month === 11 ? 0 : month + 1;
            actualYear = month === 11 ? year + 1 : year;
        }
        
        return { actualMonth, actualYear };
    }
    
    /**
     * Get CSS classes for a calendar cell
     * @param {string} type - Cell type
     * @param {boolean} isToday - Whether this is today's date
     * @returns {string} CSS class string
     */
    getCellClasses(type, isToday) {
        if (type !== Calendar.CELL_TYPES.CURRENT) {
            return 'other-month';
        }
        return isToday ? 'today' : '';
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
        const eventsByDate = this.groupEventsByDate();
        const cellsToUpdate = new Map();
        
        // Prepare fragments for each date
        Object.entries(eventsByDate).forEach(([date, events]) => {
            const fragment = document.createDocumentFragment();
            
            events.forEach(event => {
                const eventDiv = this.createEventElement(event, 'event-item');
                eventDiv.textContent = this.sanitizeHTML(event.title);
                fragment.appendChild(eventDiv);
            });
            
            cellsToUpdate.set(date, fragment);
        });
        
        // Batch DOM updates
        cellsToUpdate.forEach((fragment, date) => {
            const cell = document.querySelector(`.monthly-calendar td[data-date="${date}"]`);
            if (cell) {
                const container = cell.querySelector('.events-container');
                // Clear existing events efficiently
                container.textContent = '';
                container.appendChild(fragment);
            }
        });
    }

    /**
     * Render events in the weekly calendar view
     */
    renderEventsInWeeklyView() {
        const eventsByDate = this.groupEventsByDate();
        const cellsToUpdate = new Map();
        
        // Prepare event elements for each date
        Object.entries(eventsByDate).forEach(([date, events]) => {
            const fragment = document.createDocumentFragment();
            
            events.forEach((event, index) => {
                const eventDiv = this.createEventElement(event, 'event-item-weekly');
                
                // Apply positioning styles
                eventDiv.style.position = 'relative';
                eventDiv.style.marginTop = index === 0 ? '8px' : '4px';
                eventDiv.style.marginLeft = '8px';
                eventDiv.style.marginRight = '8px';
                eventDiv.style.zIndex = `${10 + index}`;
                
                // Build event content efficiently
                this.buildEventContent(eventDiv, event);
                fragment.appendChild(eventDiv);
            });
            
            cellsToUpdate.set(date, fragment);
        });
        
        // Batch DOM updates
        cellsToUpdate.forEach((fragment, date) => {
            const cell = document.querySelector(`.weekly-day-cell[data-date="${date}"]`);
            if (cell) {
                cell.style.position = 'relative';
                // Clear existing events efficiently
                cell.textContent = '';
                cell.appendChild(fragment);
            }
        });
    }
    
    /**
     * Build event content for weekly view
     * @param {HTMLElement} eventDiv - Event element
     * @param {Object} event - Event data
     */
    buildEventContent(eventDiv, event) {
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
    }

    /**
     * Group events by date and sort them by start time
     * @returns {Object} Object with dates as keys and sorted event arrays as values
     */
    groupEventsByDate() {
        const eventsByDate = new Map();
        
        // Group events by date
        for (const event of this.events) {
            if (!eventsByDate.has(event.date)) {
                eventsByDate.set(event.date, []);
            }
            eventsByDate.get(event.date).push(event);
        }

        // Sort events by start time within each date
        for (const events of eventsByDate.values()) {
            events.sort((a, b) => {
                const [hourA, minA] = a.startTime.split(':').map(Number);
                const [hourB, minB] = b.startTime.split(':').map(Number);
                return (hourA * Calendar.MINUTES_PER_HOUR + minA) - (hourB * Calendar.MINUTES_PER_HOUR + minB);
            });
        }

        // Convert Map to Object for compatibility
        return Object.fromEntries(eventsByDate);
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
            const startHour = String(hour).padStart(Calendar.PAD_LENGTH, Calendar.PAD_CHAR);
            const endHour = String(hour + Calendar.DEFAULT_EVENT_DURATION).padStart(Calendar.PAD_LENGTH, Calendar.PAD_CHAR);
            this.elements.eventStartTime.value = `${startHour}:00`;
            this.elements.eventEndTime.value = `${endHour}:00`;
        }
        
        this.elements.eventModalLabel.textContent = 'Add Event';
        this.elements.deleteEventBtn.style.display = 'none';
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
        const eventData = {
            id: this.elements.eventId.value,
            title: this.elements.eventTitle.value,
            date: this.elements.eventDate.value,
            startTime: this.elements.eventStartTime.value,
            endTime: this.elements.eventEndTime.value,
            description: this.elements.eventDescription.value,
            color: this.elements.eventColor.value
        };

        try {
            this.validateEventData(eventData);
            
            if (eventData.id) {
                await this.updateExistingEvent(eventData);
            } else {
                await this.createNewEvent(eventData);
            }

            await this.loadEvents();
            this.eventModal.hide();
            this.refreshCurrentView();
            this.showSuccess(eventData.id ? 'Event updated successfully' : 'Event created successfully');
        } catch (error) {
            console.error('Failed to save event:', error);
            
            if (error instanceof ValidationError) {
                this.showError(error.message);
                // Focus on the field with the error
                if (error.field) {
                    const fieldElement = this.elements[`event${error.field.charAt(0).toUpperCase() + error.field.slice(1)}`];
                    if (fieldElement) {
                        fieldElement.focus();
                    }
                }
            } else if (error instanceof APIError) {
                this.showError(`Failed to save event: ${error.message}`);
            } else {
                this.showError('An unexpected error occurred. Please try again.');
            }
        }
    }

    // =====================================================
    // VALIDATION METHODS
    // =====================================================
    
    /**
     * Validate event data with detailed error messages
     * 
     * This method performs comprehensive validation of event data before
     * sending it to the API. It checks:
     * - Required fields (title, date, times)
     * - Field formats (date YYYY-MM-DD, time HH:MM, color #RRGGBB)
     * - Field lengths (title max 100, description max 500)
     * - Time logic (end time must be after start time)
     * 
     * @param {Object} data - Event data object to validate
     * @param {string} data.title - Event title
     * @param {string} data.date - Event date in YYYY-MM-DD format
     * @param {string} data.startTime - Start time in HH:MM format
     * @param {string} data.endTime - End time in HH:MM format
     * @param {string} data.description - Optional description
     * @param {string} data.color - Hex color code
     * @returns {boolean} True if all validation passes
     * @throws {ValidationError} If any validation rule fails
     */
    validateEventData(data) {
        // === TITLE VALIDATION ===
        // Check title is provided and not just whitespace
        if (!data.title?.trim()) {
            throw new ValidationError('Event title is required', 'title');
        }
        
        // Check title length doesn't exceed maximum
        if (data.title.trim().length > 100) {
            throw new ValidationError('Event title must be 100 characters or less', 'title');
        }
        
        // === DATE VALIDATION ===
        // Check date is provided
        if (!data.date) {
            throw new ValidationError('Event date is required', 'date');
        }
        
        // Validate date format matches YYYY-MM-DD (e.g., 2024-11-30)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(data.date)) {
            throw new ValidationError('Invalid date format. Please use YYYY-MM-DD', 'date');
        }
        
        // Validate date is a real date (not 2024-99-99)
        const eventDate = new Date(data.date);
        if (isNaN(eventDate.getTime())) {
            throw new ValidationError('Invalid date', 'date');
        }
        
        // === TIME VALIDATION ===
        // Check start time is provided
        if (!data.startTime) {
            throw new ValidationError('Start time is required', 'startTime');
        }
        
        // Check end time is provided
        if (!data.endTime) {
            throw new ValidationError('End time is required', 'endTime');
        }
        
        // Validate time format matches HH:MM (e.g., 09:30, 14:00)
        const timeRegex = /^\d{2}:\d{2}$/;
        if (!timeRegex.test(data.startTime)) {
            throw new ValidationError('Invalid start time format. Please use HH:MM', 'startTime');
        }
        
        if (!timeRegex.test(data.endTime)) {
            throw new ValidationError('Invalid end time format. Please use HH:MM', 'endTime');
        }
        
        // === TIME LOGIC VALIDATION ===
        // Convert times to minutes since midnight for easy comparison
        const [startHour, startMin] = data.startTime.split(':').map(Number);
        const [endHour, endMin] = data.endTime.split(':').map(Number);
        const startMinutes = startHour * Calendar.MINUTES_PER_HOUR + startMin;
        const endMinutes = endHour * Calendar.MINUTES_PER_HOUR + endMin;
        
        // Ensure end time is after start time
        if (endMinutes <= startMinutes) {
            throw new ValidationError('End time must be after start time', 'endTime');
        }
        
        // === DESCRIPTION VALIDATION ===
        // Check description length if provided (optional field)
        if (data.description && data.description.length > 500) {
            throw new ValidationError('Description must be 500 characters or less', 'description');
        }
        
        // === COLOR VALIDATION ===
        // Validate color is in hex format (#RRGGBB, case-insensitive)
        if (!data.color || !data.color.match(/^#[0-9A-F]{6}$/i)) {
            throw new ValidationError('Invalid color format. Please use hex color code', 'color');
        }
        
        // All validation passed
        return true;
    }

    /**
     * Sanitize HTML to prevent XSS (Cross-Site Scripting) attacks
     * 
     * Converts special characters to HTML entities to prevent malicious scripts
     * from being executed when displaying user input.
     * 
     * Example: "<script>alert('XSS')</script>" becomes "&lt;script&gt;alert('XSS')&lt;/script&gt;"
     * 
     * @param {string} text - User input text that may contain HTML/scripts
     * @returns {string} Sanitized text safe for display in HTML
     */
    sanitizeHTML(text) {
        // Create temporary div element
        const div = document.createElement('div');
        
        // Set as text content (automatically escapes HTML)
        div.textContent = text;
        
        // Return the escaped HTML
        return div.innerHTML;
    }

    // =====================================================
    // API METHODS - MongoDB Database Operations
    // =====================================================
    
    /**
     * Update an existing event in MongoDB via FastAPI
     * 
     * Sends a PUT request to update event data in the database.
     * Uses retry logic to handle temporary failures.
     * 
     * @param {Object} eventData - Updated event data (must include id)
     * @param {string} eventData.id - Event ID to update
     * @returns {Promise<Object>} Updated event object from API
     */
    async updateExistingEvent(eventData) {
        const url = `${Calendar.API_URL}${Calendar.API_ENDPOINTS.EVENT_BY_ID(eventData.id)}`;
        const response = await APIClient.fetchWithRetry(url, {
            method: Calendar.HTTP_METHODS.PUT,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData)
        });
        
        return await response.json();
    }

    /**
     * Create a new event in MongoDB via API
     * @param {Object} eventData - New event data
     * @returns {Promise<Object>} Created event
     */
    async createNewEvent(eventData) {
        const url = `${Calendar.API_URL}${Calendar.API_ENDPOINTS.EVENTS}`;
        const response = await APIClient.fetchWithRetry(url, {
            method: Calendar.HTTP_METHODS.POST,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData)
        });
        
        return await response.json();
    }

    /**
     * Delete an event from MongoDB via API
     */
    async deleteEvent() {
        const eventId = this.elements.eventId.value;
        if (!eventId) {
            this.showError('No event selected for deletion');
            return;
        }

        if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
            return;
        }

        try {
            const url = `${Calendar.API_URL}${Calendar.API_ENDPOINTS.EVENT_BY_ID(eventId)}`;
            await APIClient.fetchWithRetry(url, {
                method: Calendar.HTTP_METHODS.DELETE
            });

            await this.loadEvents();
            this.eventModal.hide();
            this.refreshCurrentView();
            this.showSuccess('Event deleted successfully');
        } catch (error) {
            console.error('Failed to delete event:', error);
            
            if (error instanceof APIError && error.statusCode === 404) {
                this.showError('Event not found. It may have already been deleted.');
            } else {
                this.showError('Failed to delete event. Please try again.');
            }
        }
    }

    /**
     * Re-render the current view (month or week)
     */
    refreshCurrentView() {
        this.currentView === Calendar.VIEW_TYPES.MONTH ? this.renderMonthlyView() : this.renderWeeklyView();
    }
    
    /**
     * Display error message to user
     * @param {string} message - Error message to display
     */
    showError(message) {
        // Create a Bootstrap toast or alert
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
        alertDiv.style.zIndex = '9999';
        alertDiv.innerHTML = `
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            ${this.sanitizeHTML(message)}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertDiv);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 150);
        }, 5000);
    }
    
    /**
     * Display success message to user
     * @param {string} message - Success message to display
     */
    showSuccess(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3';
        alertDiv.style.zIndex = '9999';
        alertDiv.innerHTML = `
            <i class="bi bi-check-circle-fill me-2"></i>
            ${this.sanitizeHTML(message)}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.body.appendChild(alertDiv);
        
        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            alertDiv.classList.remove('show');
            setTimeout(() => alertDiv.remove(), 150);
        }, 3000);
    }
}

/**
 * Live Clock - Updates every second to show current time
 */
function updateClock() {
    const clockElement = document.getElementById('liveClock');
    if (!clockElement) return;
    
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    // Convert to 12-hour format with AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    const hoursStr = hours.toString().padStart(2, '0');
    
    const timeString = `${hoursStr}:${minutes}:${seconds} ${ampm}`;
    
    // Only update if the time has changed to avoid unnecessary reflows
    if (clockElement.textContent !== timeString) {
        clockElement.textContent = timeString;
    }
}

// Initialize calendar when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calendar();
    
    // Start the live clock
    updateClock(); // Update immediately
    setInterval(updateClock, 1000); // Update every second
});

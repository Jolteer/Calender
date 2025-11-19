// Calendar Application
class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.currentView = 'month';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderMonthlyView();
        this.updateCurrentPeriod();
    }

    setupEventListeners() {
        document.getElementById('monthViewBtn').addEventListener('click', () => this.switchView('month'));
        document.getElementById('weekViewBtn').addEventListener('click', () => this.switchView('week'));
        document.getElementById('prevBtn').addEventListener('click', () => this.navigate('prev'));
        document.getElementById('nextBtn').addEventListener('click', () => this.navigate('next'));
        document.getElementById('todayBtn').addEventListener('click', () => this.goToToday());
    }

    switchView(view) {
        this.currentView = view;
        const monthlyView = document.getElementById('monthlyView');
        const weeklyView = document.getElementById('weeklyView');
        const monthBtn = document.getElementById('monthViewBtn');
        const weekBtn = document.getElementById('weekViewBtn');

        if (view === 'month') {
            monthlyView.classList.remove('d-none');
            weeklyView.classList.add('d-none');
            monthBtn.classList.add('active');
            weekBtn.classList.remove('active');
            this.renderMonthlyView();
        } else {
            monthlyView.classList.add('d-none');
            weeklyView.classList.remove('d-none');
            monthBtn.classList.remove('active');
            weekBtn.classList.add('active');
            this.renderWeeklyView();
        }
        this.updateCurrentPeriod();
    }

    navigate(direction) {
        if (this.currentView === 'month') {
            const month = this.currentDate.getMonth();
            this.currentDate.setMonth(direction === 'prev' ? month - 1 : month + 1);
            this.renderMonthlyView();
        } else {
            const day = this.currentDate.getDate();
            this.currentDate.setDate(direction === 'prev' ? day - 7 : day + 7);
            this.renderWeeklyView();
        }
        this.updateCurrentPeriod();
    }

    goToToday() {
        this.currentDate = new Date();
        if (this.currentView === 'month') {
            this.renderMonthlyView();
        } else {
            this.renderWeeklyView();
        }
        this.updateCurrentPeriod();
    }

    updateCurrentPeriod() {
        const periodElement = document.getElementById('currentPeriod');
        if (this.currentView === 'month') {
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
            periodElement.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        } else {
            const weekStart = this.getWeekStart(this.currentDate);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 6);
            
            const formatDate = (date) => {
                const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
            };
            
            periodElement.textContent = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
        }
    }

    renderMonthlyView() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const prevLastDay = new Date(year, month, 0);
        
        const firstDayOfWeek = firstDay.getDay();
        const lastDate = lastDay.getDate();
        const prevLastDate = prevLastDay.getDate();
        
        const today = new Date();
        const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
        const todayDate = today.getDate();

        let html = '';
        let day = 1;
        let nextMonthDay = 1;

        // Calculate total rows needed
        const totalCells = firstDayOfWeek + lastDate;
        const rows = Math.ceil(totalCells / 7);

        for (let i = 0; i < rows; i++) {
            html += '<tr>';
            for (let j = 0; j < 7; j++) {
                const cellIndex = i * 7 + j;
                
                if (cellIndex < firstDayOfWeek) {
                    // Previous month days
                    const prevDay = prevLastDate - firstDayOfWeek + cellIndex + 1;
                    html += `<td class="other-month"><div class="day-number">${prevDay}</div></td>`;
                } else if (day <= lastDate) {
                    // Current month days
                    const isToday = isCurrentMonth && day === todayDate;
                    const todayClass = isToday ? 'today' : '';
                    html += `<td class="${todayClass}"><div class="day-number">${day}</div></td>`;
                    day++;
                } else {
                    // Next month days
                    html += `<td class="other-month"><div class="day-number">${nextMonthDay}</div></td>`;
                    nextMonthDay++;
                }
            }
            html += '</tr>';
        }

        document.getElementById('monthlyCalendarBody').innerHTML = html;
    }

    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day;
        return new Date(d.setDate(diff));
    }

    renderWeeklyView() {
        const weekStart = this.getWeekStart(this.currentDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Update headers
        const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const headerIds = ['sun-header', 'mon-header', 'tue-header', 'wed-header', 'thu-header', 'fri-header', 'sat-header'];
        
        for (let i = 0; i < 7; i++) {
            const currentDay = new Date(weekStart);
            currentDay.setDate(currentDay.getDate() + i);
            const isToday = currentDay.getTime() === today.getTime();
            const headerClass = isToday ? 'current-day-header' : '';
            
            document.getElementById(headerIds[i]).innerHTML = `
                <div class="day-header ${headerClass}">
                    <div class="day-name">${dayNames[i]}</div>
                    <div class="day-date">${currentDay.getDate()}</div>
                </div>
            `;
        }

        // Generate time slots
        let html = '';
        for (let hour = 0; hour < 24; hour++) {
            html += '<tr>';
            
            // Time column
            const timeStr = hour === 0 ? '12 AM' : 
                           hour < 12 ? `${hour} AM` : 
                           hour === 12 ? '12 PM' : 
                           `${hour - 12} PM`;
            html += `<td class="time-cell">${timeStr}</td>`;
            
            // Day columns
            for (let day = 0; day < 7; day++) {
                const currentDay = new Date(weekStart);
                currentDay.setDate(currentDay.getDate() + day);
                const isToday = currentDay.getTime() === today.getTime();
                const todayClass = isToday ? 'weekly-today' : '';
                html += `<td class="${todayClass}"></td>`;
            }
            
            html += '</tr>';
        }

        document.getElementById('weeklyCalendarBody').innerHTML = html;
    }
}

// Initialize calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calendar();
});

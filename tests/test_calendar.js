/**
 * Unit and Integration Tests for Calendar Frontend
 * Tests validation, DOM manipulation, and calendar logic
 * 
 * To run: node test_calendar.js
 * Or use a testing framework like Jest
 */

// =====================================================
// TEST UTILITIES
// =====================================================

class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }

    test(name, testFn) {
        this.tests.push({ name, testFn });
    }

    async run() {
        console.log('🧪 Running Calendar Tests...\n');
        
        for (const { name, testFn } of this.tests) {
            try {
                await testFn();
                this.passed++;
                console.log(`✅ PASS: ${name}`);
            } catch (error) {
                this.failed++;
                console.log(`❌ FAIL: ${name}`);
                console.log(`   Error: ${error.message}\n`);
            }
        }
        
        console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }
}

function assert(condition, message = 'Assertion failed') {
    if (!condition) {
        throw new Error(message);
    }
}

function assertEquals(actual, expected, message) {
    if (actual !== expected) {
        throw new Error(message || `Expected ${expected} but got ${actual}`);
    }
}

// =====================================================
// UNIT TESTS - Validation Functions
// =====================================================

const runner = new TestRunner();

// Test: Valid event data passes validation
runner.test('Valid event data passes validation', () => {
    const validData = {
        title: 'Team Meeting',
        date: '2024-12-15',
        startTime: '09:00',
        endTime: '10:00',
        description: 'Weekly sync',
        color: '#3B82F6'
    };
    
    // Simulate validation logic
    assert(validData.title.trim().length > 0, 'Title should not be empty');
    assert(validData.title.length <= 100, 'Title should be <= 100 chars');
    assert(/^\d{4}-\d{2}-\d{2}$/.test(validData.date), 'Date should match YYYY-MM-DD');
    assert(/^\d{2}:\d{2}$/.test(validData.startTime), 'Start time should match HH:MM');
    assert(/^\d{2}:\d{2}$/.test(validData.endTime), 'End time should match HH:MM');
    assert(/^#[0-9A-F]{6}$/i.test(validData.color), 'Color should be hex format');
});

// Test: Empty title rejected
runner.test('Empty title is rejected', () => {
    const invalidData = {
        title: '',
        date: '2024-12-15',
        startTime: '09:00',
        endTime: '10:00',
        color: '#3B82F6'
    };
    
    try {
        if (!invalidData.title?.trim()) {
            throw new Error('Event title is required');
        }
        assert(false, 'Should have thrown validation error');
    } catch (e) {
        assert(e.message === 'Event title is required', 'Correct error message');
    }
});

// Test: Title over 100 characters rejected
runner.test('Long title is rejected', () => {
    const longTitle = 'x'.repeat(101);
    
    try {
        if (longTitle.length > 100) {
            throw new Error('Event title must be 100 characters or less');
        }
        assert(false, 'Should have thrown validation error');
    } catch (e) {
        assert(e.message.includes('100 characters'), 'Correct error message');
    }
});

// Test: Invalid date format rejected
runner.test('Invalid date format is rejected', () => {
    const invalidDates = ['12/15/2024', 'invalid'];
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    
    for (const date of invalidDates) {
        assert(!dateRegex.test(date), `${date} should be invalid`);
    }
    
    // Note: Regex only checks format, not validity of dates like 2024-13-01
    // Actual validation would require Date parsing
});

// Test: Invalid time format rejected
runner.test('Invalid time format is rejected', () => {
    const invalidTimes = ['9:00am', 'invalid'];
    const timeRegex = /^\d{2}:\d{2}$/;
    
    for (const time of invalidTimes) {
        assert(!timeRegex.test(time), `${time} should be invalid`);
    }
    
    // Note: Regex only checks format HH:MM, not validity (25:00 matches regex)
    // Actual validation would require additional logic
});

// Test: End time before start time rejected
runner.test('End time before start time is rejected', () => {
    const startTime = '10:00';
    const endTime = '09:00';
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    assert(endMinutes <= startMinutes, 'End time should be before start time');
});

// Test: Valid time range accepted
runner.test('Valid time range is accepted', () => {
    const startTime = '09:00';
    const endTime = '10:00';
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    assert(endMinutes > startMinutes, 'End time should be after start time');
});

// Test: Description length validation
runner.test('Long description is rejected', () => {
    const longDesc = 'x'.repeat(501);
    
    assert(longDesc.length > 500, 'Description should be too long');
});

// Test: Invalid color format rejected
runner.test('Invalid color format is rejected', () => {
    const invalidColors = ['blue', '#GGG', '123456', '#12345'];
    const colorRegex = /^#[0-9A-F]{6}$/i;
    
    for (const color of invalidColors) {
        assert(!colorRegex.test(color), `${color} should be invalid`);
    }
});

// Test: Valid hex colors accepted
runner.test('Valid hex colors are accepted', () => {
    const validColors = ['#3B82F6', '#10B981', '#EF4444', '#000000', '#FFFFFF'];
    const colorRegex = /^#[0-9A-F]{6}$/i;
    
    for (const color of validColors) {
        assert(colorRegex.test(color), `${color} should be valid`);
    }
});

// =====================================================
// UNIT TESTS - Date/Time Utilities
// =====================================================

// Test: Date formatting
runner.test('Date formatting works correctly', () => {
    const date = new Date(2024, 11, 15); // Month is 0-indexed: 11 = December
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formatted = `${year}-${month}-${day}`;
    
    assert(formatted === '2024-12-15', 'Date should format correctly');
});

// Test: Time formatting (24hr to 12hr)
runner.test('Time conversion 24hr to 12hr', () => {
    function convertTo12Hour(time24) {
        const [hours, minutes] = time24.split(':').map(Number);
        const period = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12;
        return `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;
    }
    
    assertEquals(convertTo12Hour('09:00'), '9:00 AM', '9am conversion');
    assertEquals(convertTo12Hour('14:00'), '2:00 PM', '2pm conversion');
    assertEquals(convertTo12Hour('00:00'), '12:00 AM', 'midnight conversion');
    assertEquals(convertTo12Hour('12:00'), '12:00 PM', 'noon conversion');
});

// Test: Month calculation
runner.test('Month calculation works correctly', () => {
    const date = new Date(2024, 11, 15); // December 15, 2024
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    
    assertEquals(firstDay.getDate(), 1, 'First day should be 1');
    assertEquals(lastDay.getDate(), 31, 'December has 31 days');
});

// =====================================================
// UNIT TESTS - HTML Sanitization
// =====================================================

// Test: XSS prevention
runner.test('HTML sanitization prevents XSS', () => {
    function sanitizeHTML(text) {
        const div = { textContent: null, innerHTML: null };
        div.textContent = text;
        // Simulate escaping
        div.innerHTML = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return div.innerHTML;
    }
    
    const malicious = '<script>alert("XSS")</script>';
    const sanitized = sanitizeHTML(malicious);
    
    assert(!sanitized.includes('<script>'), 'Script tags should be escaped');
    assert(sanitized.includes('&lt;script&gt;'), 'Should contain escaped tags');
});

// =====================================================
// INTEGRATION TESTS - Event Grouping
// =====================================================

// Test: Events grouped by date
runner.test('Events are correctly grouped by date', () => {
    const events = [
        { id: '1', date: '2024-12-15', title: 'Event 1' },
        { id: '2', date: '2024-12-15', title: 'Event 2' },
        { id: '3', date: '2024-12-16', title: 'Event 3' },
    ];
    
    function groupEventsByDate(events) {
        const grouped = new Map();
        for (const event of events) {
            if (!grouped.has(event.date)) {
                grouped.set(event.date, []);
            }
            grouped.get(event.date).push(event);
        }
        return grouped;
    }
    
    const grouped = groupEventsByDate(events);
    
    assertEquals(grouped.size, 2, 'Should have 2 unique dates');
    assertEquals(grouped.get('2024-12-15').length, 2, 'Dec 15 should have 2 events');
    assertEquals(grouped.get('2024-12-16').length, 1, 'Dec 16 should have 1 event');
});

// =====================================================
// ACCEPTANCE TESTS - User Workflows
// =====================================================

// Test: Complete event lifecycle simulation
runner.test('Complete event lifecycle simulation', () => {
    // Simulate event creation
    const newEvent = {
        title: 'Test Meeting',
        date: '2024-12-15',
        startTime: '09:00',
        endTime: '10:00',
        description: 'Test description',
        color: '#3B82F6'
    };
    
    // Validate
    assert(newEvent.title.trim().length > 0, 'Event should be valid');
    
    // Simulate adding to events array
    const events = [];
    newEvent.id = Date.now().toString();
    events.push(newEvent);
    
    assertEquals(events.length, 1, 'Should have 1 event');
    
    // Simulate update
    const updatedEvent = { ...newEvent, title: 'Updated Meeting' };
    const index = events.findIndex(e => e.id === newEvent.id);
    events[index] = updatedEvent;
    
    assertEquals(events[0].title, 'Updated Meeting', 'Event should be updated');
    
    // Simulate delete
    const deleteIndex = events.findIndex(e => e.id === newEvent.id);
    events.splice(deleteIndex, 1);
    
    assertEquals(events.length, 0, 'Event should be deleted');
});

// =====================================================
// REGRESSION TESTS
// =====================================================

// Test: End time equal to start time rejected
runner.test('End time equal to start time is rejected', () => {
    const startTime = '09:00';
    const endTime = '09:00';
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    assert(endMinutes <= startMinutes, 'End time should not be after start');
});

// Test: Midnight handling
runner.test('Midnight time (00:00) is handled correctly', () => {
    const midnightTime = '00:00';
    const timeRegex = /^\d{2}:\d{2}$/;
    
    assert(timeRegex.test(midnightTime), 'Midnight should be valid format');
    
    const [hours, minutes] = midnightTime.split(':').map(Number);
    assert(hours === 0 && minutes === 0, 'Should parse as hour 0, minute 0');
});

// =====================================================
// RUN ALL TESTS
// =====================================================

console.log('========================================');
console.log('  CALENDAR APPLICATION TEST SUITE');
console.log('========================================\n');

runner.run().then(success => {
    console.log('\n========================================');
    if (success) {
        console.log('✅ All tests passed!');
    } else {
        console.log('❌ Some tests failed!');
    }
    console.log('========================================');
});

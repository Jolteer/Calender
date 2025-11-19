# Calendar Application

A modern, ADHD-friendly calendar application with monthly and weekly views, built with HTML, CSS, and JavaScript.

## Features

- **Dual View Modes**: Switch between monthly grid view and weekly column view
- **Event Management**: Create, edit, and delete events with color coding
- **Persistent Storage**: Events are saved in browser localStorage
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Blue ocean theme with smooth animations and transitions
- **Accessibility**: Keyboard navigation support and focus indicators

## Project Structure

```
Calender-1/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # All CSS styles and theming
├── js/
│   └── script.js       # Calendar logic and event handling
├── assets/             # For future images, icons, or media files
└── README.md           # Project documentation
```

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables, gradients, and animations
- **JavaScript (ES6+)**: Class-based architecture with modern features
- **Bootstrap 5.3.0**: Responsive layout and UI components
- **Bootstrap Icons 1.10.0**: Icon library

## Getting Started

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. No build process or dependencies required - it just works!

## Usage

### Monthly View
- Click on any day to create a new event
- Click on an existing event to edit or delete it
- Today's date is highlighted with a gradient background
- Events appear as colored badges below the day number

### Weekly View
- View an entire week at a glance with vertical day columns
- Events show full details including title, time, and description
- Click on any day column to add a new event
- Click on events to edit or delete them

### Event Management
- **Create**: Click on any day in either view
- **Edit**: Click on an existing event
- **Delete**: Open event editor and click the Delete button
- **Color Code**: Choose from 7 colors to categorize events

## Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Opera (latest)

## Local Storage

Events are automatically saved to browser localStorage. Your events will persist between sessions unless you:
- Clear browser data
- Use incognito/private browsing mode
- Manually clear localStorage

## Customization

### Color Theme
Edit CSS variables in `css/styles.css` (lines 6-22) to change the color scheme:
```css
:root {
    --primary-color: #0EA5E9;
    --secondary-color: #06B6D4;
    /* ... more colors */
}
```

### Event Colors
Modify the color options in `index.html` (lines 164-171) to add or change event colors.

## License

Free to use for educational purposes.

## Author

Created for ASE 420 - Software Engineering Course

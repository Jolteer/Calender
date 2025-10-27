# ADHD Calendar

A simple, clean calendar application built with PySide6 (Qt for Python) designed for easy navigation and minimal distractions.

## Features

- 🗓️ **Clean Calendar Interface** - Simple, distraction-free calendar view
- 🔄 **Easy Navigation** - Previous/Next month buttons and Today shortcut
- 📅 **Date Selection** - Click any date to see it highlighted
- 🎨 **Modern UI** - Professional styling with hover effects
- 🚫 **No Clutter** - Week numbers removed for cleaner appearance
- ⚡ **Lightweight** - Fast startup and responsive interface

## Screenshots

The calendar features a clean, modern interface with:
- Blue navigation buttons for month switching
- Orange "Today" button for quick navigation
- Selected date display at the bottom
- Grid layout without week numbers for clarity

## Requirements

- Python 3.7+
- PySide6

## Installation

### Option 1: Using Virtual Environment (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/Jolteer/Adhd-calender.git
cd Adhd-calender
```

2. Create and activate virtual environment:
```bash
python -m venv .venv
# On Windows:
.venv\Scripts\Activate.ps1
# On macOS/Linux:
source .venv/bin/activate
```

3. Install dependencies:
```bash
pip install PySide6
```

### Option 2: Global Installation

1. Install PySide6 globally:
```bash
pip install PySide6
```

2. Download the `calender.py` file

## Usage

### Running the Application

**With Virtual Environment:**
```bash
# Make sure virtual environment is activated
.venv\Scripts\Activate.ps1  # Windows
source .venv/bin/activate   # macOS/Linux

python calender.py
```

**Without Virtual Environment:**
```bash
python calender.py
```

**Using the Convenience Scripts:**
- Double-click `run_calendar.bat` (Windows Batch)
- Run `run_calendar.ps1` (PowerShell)

### Application Controls

- **Previous/Next Buttons**: Navigate between months
- **Today Button**: Jump to current date instantly
- **Date Selection**: Click any date to select it
- **Date Display**: View selected date at the bottom

## File Structure

```
Adhd-calender/
├── calender.py           # Main application file
├── run_calendar.bat      # Windows batch script
├── run_calendar.ps1      # PowerShell script
├── README.md            # This file
└── .venv/               # Virtual environment (if used)
```

## Code Architecture

The application follows clean code principles with:

### Classes

- **`CalendarConfig`**: Configuration constants (window size, colors, text)
- **`SimpleCalendar`**: Main calendar window (inherits from QMainWindow)
- **`CalendarApplication`**: Application lifecycle manager

### Key Methods

- **UI Creation**: Modular methods for creating interface components
- **Event Handling**: Clean signal/slot connections for user interactions
- **Navigation**: Separate methods for each navigation action
- **Styling**: CSS-like styling separated into dedicated methods

### Design Patterns

- **Configuration Pattern**: All constants centralized in `CalendarConfig`
- **Factory Pattern**: Separate methods for creating UI components
- **Observer Pattern**: Qt's signal/slot system for event handling
- **Single Responsibility**: Each method has one clear purpose

## Customization

### Changing Colors

Edit the stylesheet in `_get_main_stylesheet()` method:

```python
QPushButton {
    background-color: #2196F3;  # Change button color
    color: white;
}
```

### Changing Window Size

Modify `CalendarConfig` class:

```python
class CalendarConfig:
    WINDOW_WIDTH = 800   # Default: 600
    WINDOW_HEIGHT = 600  # Default: 500
```

### Changing Date Format

Update the date format in `CalendarConfig`:

```python
DATE_FORMAT = "MM/dd/yyyy"  # American format
# or
DATE_FORMAT = "dd/MM/yyyy"  # European format
```

## Development

### Code Style

- **Type Hints**: All methods include proper type annotations
- **Comments**: Single-line comments using `#` style
- **Naming**: Private methods prefixed with `_`
- **Constants**: Uppercase constants in configuration class

### Adding Features

The modular design makes it easy to add new features:

1. Add configuration constants to `CalendarConfig`
2. Create UI components in separate methods
3. Add event handlers with proper signal connections
4. Update styling in stylesheet methods

## Troubleshooting

### Common Issues

**PySide6 Import Error:**
```bash
pip install PySide6
```

**Virtual Environment Issues:**
```bash
# Recreate virtual environment
rm -rf .venv  # or rmdir /s .venv on Windows
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install PySide6
```

**Application Won't Start:**
- Ensure Python 3.7+ is installed
- Check that PySide6 is properly installed
- Try running from command line to see error messages

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Author

**Jolteer**
- GitHub: [@Jolteer](https://github.com/Jolteer)

## Acknowledgments

- Built with [PySide6](https://doc.qt.io/qtforpython/) (Qt for Python)
- Designed for ADHD-friendly minimal interface
- Inspired by the need for distraction-free productivity tools

---

*Simple, clean, and focused - just the way a calendar should be.* 📅
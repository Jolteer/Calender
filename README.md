# Calendar Application

A simple, clean calendar application built with PySide6 (Qt for Python) designed for easy navigation and minimal distractions.

## Features

- 🗓️ **Clean Calendar Interface** - Simple, distraction-free calendar view
- 🔄 **Easy Navigation** - Previous/Next month buttons and Today shortcut
- 📅 **Date Selection** - Click any date to see it highlighted
- 🎨 **Modern UI** - Professional styling with hover effects
- 🚫 **No Clutter** - Week numbers removed for cleaner appearance
- ⚡ **Lightweight** - Fast startup and responsive interface

## Requirements

- Python 3.7+
- PySide6

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Jolteer/Calender.git
cd Calender
```

### Step 2: Set Up Python Environment

#### Option A: Using Virtual Environment (Recommended)

**On Windows:**
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
.venv\Scripts\activate.bat
# or for PowerShell:
.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt
```

**On macOS/Linux:**
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

#### Option B: Global Installation

```bash
pip install PySide6>=6.10.0
```

## Running the Application

### Method 1: Using Convenience Scripts (Windows)

**Batch Script:**
- Double-click `run_calendar.bat`

**PowerShell Script:**
- Right-click `run_calendar.ps1` → "Run with PowerShell"
- Or from PowerShell: `.\run_calendar.ps1`

### Method 2: Command Line

**With Virtual Environment:**
```bash
# Activate virtual environment first
.venv\Scripts\activate.bat  # Windows
source .venv/bin/activate   # macOS/Linux

# Run the application
python main.py
```

**Without Virtual Environment:**
```bash
python main.py
```

## File Structure

```
Calendar/
├── main.py                 # Application entry point
├── requirements.txt        # Python dependencies
├── run_calendar.bat       # Windows batch script
├── run_calendar.ps1       # PowerShell script
├── README.md              # This file
├── config/
│   └── settings.py        # Application configuration
├── core/
│   ├── __init__.py
│   └── application.py     # Main application logic
├── ui/
│   ├── __init__.py
│   ├── calendar_window.py # Calendar window implementation
│   └── styles.py          # UI styling
└── .venv/                 # Virtual environment (created after setup)
```

## Application Controls

- **Previous/Next Buttons**: Navigate between months
- **Today Button**: Jump to current date instantly
- **Date Selection**: Click any date to select it
- **Date Display**: View selected date at the bottom

## Code Architecture

The application follows clean code principles with a modular structure:

### Main Components

- **`main.py`**: Application entry point
- **`core/application.py`**: Main application logic and lifecycle management
- **`ui/calendar_window.py`**: Calendar window implementation
- **`ui/styles.py`**: UI styling definitions
- **`config/settings.py`**: Configuration constants

### Key Features

- **Modular Design**: Clean separation of concerns
- **Configuration Management**: Centralized settings
- **Modern UI**: PySide6-based interface
- **Cross-Platform**: Works on Windows, macOS, and Linux

## Customization

You can customize the application by modifying the settings in `config/settings.py`:

```python
class CalendarConfig:
    WINDOW_TITLE = "Your Custom Title"
    WINDOW_WIDTH = 800  # Change window size
    WINDOW_HEIGHT = 600
    # ... other settings
```

## Troubleshooting

### Common Issues

**PySide6 Import Error:**
```bash
pip install PySide6>=6.10.0
```

**Virtual Environment Issues:**
```bash
# Remove and recreate virtual environment
# Windows:
rmdir /s .venv
python -m venv .venv
.venv\Scripts\activate.bat
pip install -r requirements.txt

# macOS/Linux:
rm -rf .venv
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

**Permission Issues (Windows PowerShell):**
If you get execution policy errors, run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

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

---

*Simple, clean, and focused - just the way a calendar should be.* 📅

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
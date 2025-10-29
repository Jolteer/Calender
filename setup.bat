@echo off
REM Setup script for Calendar Application (Windows)

echo Setting up Calendar Application...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed. Please install Python 3.7+ first.
    pause
    exit /b 1
)

REM Create virtual environment
echo Creating virtual environment...
python -m venv .venv

REM Activate virtual environment
echo Activating virtual environment...
call .venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Setup complete! To run the application:
echo 1. Double-click run_calendar.bat
echo 2. Or activate virtual environment and run: python main.py
echo.
pause
@echo off
REM Change to the directory where this script is located
cd /d "%~dp0"
REM Activate virtual environment if it exists, otherwise use system Python
if exist ".venv\Scripts\activate.bat" (
    call .venv\Scripts\activate.bat
) else (
    echo No virtual environment found. Using system Python.
)
python main.py
pause
#!/bin/bash

# Setup script for Calendar Application (macOS/Linux)

echo "Setting up Calendar Application..."

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "Error: Python is not installed. Please install Python 3.7+ first."
    exit 1
fi

# Create virtual environment
echo "Creating virtual environment..."
python -m venv .venv

# Activate virtual environment
echo "Activating virtual environment..."
source .venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

echo "Setup complete! To run the application:"
echo "1. Activate the virtual environment: source .venv/bin/activate"
echo "2. Run the application: python main.py"
echo ""
echo "Or simply run: python main.py (if you prefer to use system Python)"
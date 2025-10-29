# Change to the directory where this script is located
Set-Location $PSScriptRoot

# Activate virtual environment if it exists, otherwise use system Python
if (Test-Path ".venv\Scripts\Activate.ps1") {
    & .\.venv\Scripts\Activate.ps1
    Write-Host "Virtual environment activated."
} else {
    Write-Host "No virtual environment found. Using system Python."
}

python main.py
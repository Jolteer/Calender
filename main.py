# Main entry point for the ADHD Calendar application.

import sys

from core.application import CalendarApplication


def main() -> int:
    # Application entry point.
    try:
        calendar_app = CalendarApplication()
        return calendar_app.start()
    except Exception as e:
        print(f"Error starting application: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
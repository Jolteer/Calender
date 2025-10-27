# Application lifecycle manager.

import sys
from typing import Optional

from PySide6.QtWidgets import QApplication

from ui.calendar_window import SimpleCalendar


class CalendarApplication:
    # Application manager for the Simple Calendar.
    
    def __init__(self) -> None:
        # Initialize the application.
        self.app: Optional[QApplication] = None
        self.window: Optional[SimpleCalendar] = None
    
    def setup_application(self) -> None:
        # Set up the QApplication with proper configuration.
        self.app = QApplication(sys.argv)
        self.app.setApplicationName("Simple Calendar")
        self.app.setApplicationVersion("1.0")
    
    def create_window(self) -> None:
        # Create and configure the main window.
        self.window = SimpleCalendar()
    
    def run(self) -> int:
        # Run the application event loop.
        if not self.app or not self.window:
            raise RuntimeError("Application not properly initialized")
        
        self.window.show()
        return self.app.exec()
    
    def start(self) -> int:
        # Start the complete application.
        self.setup_application()
        self.create_window()
        return self.run()
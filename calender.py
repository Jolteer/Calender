import sys
from typing import Optional

from PySide6.QtWidgets import (
    QApplication,
    QMainWindow,
    QWidget,
    QVBoxLayout,
    QHBoxLayout,
    QCalendarWidget,
    QLabel,
    QPushButton
)
from PySide6.QtCore import Qt, QDate


class CalendarConfig:
    # Configuration constants for the calendar application.
    
    # Window settings
    WINDOW_TITLE = "Simple Calendar - PySide6"
    WINDOW_X = 100
    WINDOW_Y = 100
    WINDOW_WIDTH = 600
    WINDOW_HEIGHT = 500
    
    # Date format
    DATE_FORMAT = "dddd, MMMM d, yyyy"
    
    # Button texts
    PREV_BUTTON_TEXT = "◀ Previous"
    TODAY_BUTTON_TEXT = "Today"
    NEXT_BUTTON_TEXT = "Next ▶"
    TITLE_TEXT = "Calendar"


class SimpleCalendar(QMainWindow):
    
    def __init__(self) -> None:
        # Initialize the calendar application.
        super().__init__()
        
        # Initialize UI components (will be set in setup_ui)
        self.calendar: Optional[QCalendarWidget] = None
        self.selected_date_label: Optional[QLabel] = None
        self.prev_month_btn: Optional[QPushButton] = None
        self.today_btn: Optional[QPushButton] = None
        self.next_month_btn: Optional[QPushButton] = None
        
        self._configure_window()
        self._initialize_application()
    
    def _configure_window(self) -> None:
        # Configure basic window properties.
        self.setWindowTitle(CalendarConfig.WINDOW_TITLE)
        self.setGeometry(
            CalendarConfig.WINDOW_X,
            CalendarConfig.WINDOW_Y,
            CalendarConfig.WINDOW_WIDTH,
            CalendarConfig.WINDOW_HEIGHT
        )
    
    def _initialize_application(self) -> None:
        # Initialize all application components.
        self._setup_ui()
        self._setup_styling()
        self._connect_signals()
        self._set_initial_date()
    
    def _setup_ui(self) -> None:
        # Create and arrange all user interface elements.
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        
        main_layout = QVBoxLayout(central_widget)
        
        # Add components to layout
        main_layout.addWidget(self._create_title_label())
        main_layout.addLayout(self._create_navigation_layout())
        main_layout.addWidget(self._create_calendar_widget())
        main_layout.addWidget(self._create_date_info_label())
    
    def _create_title_label(self) -> QLabel:
        # Create and configure the title label.
        title = QLabel(CalendarConfig.TITLE_TEXT)
        title.setAlignment(Qt.AlignCenter)
        title.setStyleSheet("font-size: 20px; font-weight: bold; margin: 15px;")
        return title
    
    def _create_navigation_layout(self) -> QHBoxLayout:
        # Create the navigation buttons layout.
        nav_layout = QHBoxLayout()
        
        self.prev_month_btn = QPushButton(CalendarConfig.PREV_BUTTON_TEXT)
        self.today_btn = QPushButton(CalendarConfig.TODAY_BUTTON_TEXT)
        self.next_month_btn = QPushButton(CalendarConfig.NEXT_BUTTON_TEXT)
        
        nav_layout.addWidget(self.prev_month_btn)
        nav_layout.addWidget(self.today_btn)
        nav_layout.addWidget(self.next_month_btn)
        
        return nav_layout
    
    def _create_calendar_widget(self) -> QCalendarWidget:
        # Create and configure the calendar widget.
        self.calendar = QCalendarWidget()
        self.calendar.setGridVisible(True)
        self.calendar.setVerticalHeaderFormat(
            QCalendarWidget.VerticalHeaderFormat.NoVerticalHeader
        )
        return self.calendar
    
    def _create_date_info_label(self) -> QLabel:
        # Create the selected date information label.
        self.selected_date_label = QLabel()
        self.selected_date_label.setAlignment(Qt.AlignCenter)
        self.selected_date_label.setStyleSheet(
            "font-size: 16px; margin: 10px; padding: 10px; "
            "background-color: #e3f2fd; border-radius: 5px;"
        )
        return self.selected_date_label
    
    def _setup_styling(self) -> None:
        # Apply modern styling to the application.
        self.setStyleSheet(self._get_main_stylesheet())
        if self.today_btn:
            self.today_btn.setStyleSheet(self._get_today_button_stylesheet())
    
    def _get_main_stylesheet(self) -> str:
        # Get the main application stylesheet.
        return """
            QMainWindow {
                background-color: #f5f5f5;
            }
            
            QPushButton {
                background-color: #2196F3;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                font-weight: bold;
                margin: 5px;
                font-size: 12px;
            }
            
            QPushButton:hover {
                background-color: #1976D2;
            }
            
            QPushButton:pressed {
                background-color: #0D47A1;
            }
            
            QCalendarWidget {
                border: 2px solid #bdc3c7;
                border-radius: 10px;
                background-color: white;
                margin: 10px;
            }
            
            QCalendarWidget QToolButton {
                background-color: #34495e;
                color: white;
                border: none;
                border-radius: 4px;
                margin: 2px;
                padding: 6px;
            }
            
            QCalendarWidget QToolButton:hover {
                background-color: #2c3e50;
            }
            
            QCalendarWidget QMenu {
                background-color: white;
                border: 1px solid #bdc3c7;
            }
            
            QCalendarWidget QSpinBox {
                background-color: white;
                border: 1px solid #bdc3c7;
                border-radius: 4px;
                padding: 4px;
            }
            
            QLabel {
                color: #2c3e50;
            }
        """
    
    def _get_today_button_stylesheet(self) -> str:
        # Get the Today button specific stylesheet.
        return """
            QPushButton {
                background-color: #FF5722;
                color: white;
                font-weight: bold;
            }
            QPushButton:hover {
                background-color: #E64A19;
            }
            QPushButton:pressed {
                background-color: #D84315;
            }
        """
    
    def _connect_signals(self) -> None:
        # Connect UI signals to their respective slot methods.
        if self.calendar:
            self.calendar.selectionChanged.connect(self._on_date_selected)
        
        if self.prev_month_btn:
            self.prev_month_btn.clicked.connect(self._navigate_previous_month)
        
        if self.next_month_btn:
            self.next_month_btn.clicked.connect(self._navigate_next_month)
        
        if self.today_btn:
            self.today_btn.clicked.connect(self._navigate_to_today)
    
    def _set_initial_date(self) -> None:
        # Set the calendar to today's date on startup.
        today = QDate.currentDate()
        if self.calendar:
            self.calendar.setSelectedDate(today)
        self._update_date_display(today)
    
    # Event Handlers
    def _on_date_selected(self) -> None:
        # Handle calendar date selection events.
        if self.calendar:
            selected_date = self.calendar.selectedDate()
            self._update_date_display(selected_date)
    
    def _navigate_previous_month(self) -> None:
        # Navigate to the previous month.
        if self.calendar:
            current_date = self.calendar.selectedDate()
            previous_month = current_date.addMonths(-1)
            self.calendar.setSelectedDate(previous_month)
    
    def _navigate_next_month(self) -> None:
        # Navigate to the next month.
        if self.calendar:
            current_date = self.calendar.selectedDate()
            next_month = current_date.addMonths(1)
            self.calendar.setSelectedDate(next_month)
    
    def _navigate_to_today(self) -> None:
        # Navigate to today's date.
        today = QDate.currentDate()
        if self.calendar:
            self.calendar.setSelectedDate(today)
    
    def _update_date_display(self, date: QDate) -> None:
        # Update the selected date display label.
        if self.selected_date_label:
            date_str = date.toString(CalendarConfig.DATE_FORMAT)
            self.selected_date_label.setText(f"Selected Date: {date_str}")


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

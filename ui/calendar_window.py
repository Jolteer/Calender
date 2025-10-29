# Main calendar window implementation.

from typing import Optional

from PySide6.QtWidgets import (
    QMainWindow,
    QWidget,
    QVBoxLayout,
    QCalendarWidget,
    QLabel
)
from PySide6.QtCore import Qt, QDate

from config.settings import CalendarConfig
from ui.styles import get_main_stylesheet


class SimpleCalendar(QMainWindow):
    
    def __init__(self) -> None:
        # Initialize the calendar application.
        super().__init__()
        
        # Initialize UI components (will be set in setup_ui)
        self.calendar: Optional[QCalendarWidget] = None
        self.selected_date_label: Optional[QLabel] = None
        
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
        main_layout.addWidget(self._create_calendar_widget())
        main_layout.addWidget(self._create_date_info_label())
    

    
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
        self.selected_date_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self.selected_date_label.setStyleSheet(
            "font-size: 16px; margin: 10px; padding: 10px; "
            "background-color: #e3f2fd; border-radius: 5px;"
        )
        return self.selected_date_label
    
    def _setup_styling(self) -> None:
        # Apply modern styling to the application.
        self.setStyleSheet(get_main_stylesheet())
    
    def _connect_signals(self) -> None:
        # Connect UI signals to their respective slot methods.
        if self.calendar:
            self.calendar.selectionChanged.connect(self._on_date_selected)
    
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
    

    
    def _update_date_display(self, date: QDate) -> None:
        # Update the selected date display label.
        if self.selected_date_label:
            date_str = date.toString(CalendarConfig.DATE_FORMAT)
            self.selected_date_label.setText(f"Selected Date: {date_str}")
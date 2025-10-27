# Stylesheet definitions for the calendar application.

def get_main_stylesheet() -> str:
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


def get_today_button_stylesheet() -> str:
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
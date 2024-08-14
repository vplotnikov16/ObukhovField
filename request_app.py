import sys
import requests
from PyQt5.QtWidgets import QApplication, QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QGridLayout, QPushButton, \
    QCheckBox, QRadioButton, QLabel, QTabWidget, QFrame, QMessageBox


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Конфигуратор")
        self.setGeometry(100, 100, 400, 600)

        # Основной виджет с вкладками
        self.tab_widget = QTabWidget()
        self.setCentralWidget(self.tab_widget)

        # Вкладка редактирования
        self.edit_tab = QWidget()
        self.create_edit_tab()
        self.tab_widget.addTab(self.edit_tab, "Редактирование")

        # Вкладка просмотра
        self.view_tab = QWidget()
        self.create_view_tab()
        self.tab_widget.addTab(self.view_tab, "Просмотр")

    def create_edit_tab(self):
        layout = QVBoxLayout()

        # Сетка 5x5 из checkbox'ов с равными отступами и увеличенным размером
        grid_layout = QGridLayout()
        grid_layout.setSpacing(10)  # Устанавливаем равные отступы между элементами
        self.checkboxes = []
        for i in range(5):
            for j in range(5):
                checkbox = QCheckBox()
                checkbox.setFixedSize(40, 40)  # Увеличенный размер
                checkbox.setText('')  # Удаляем текстовый label
                self.checkboxes.append(checkbox)
                grid_layout.addWidget(checkbox, i, j)
        layout.addLayout(grid_layout)

        # Кнопка "Сохранить конфигурацию"
        save_button = QPushButton("Сохранить конфигурацию")
        save_button.clicked.connect(self.save_configuration)
        layout.addWidget(save_button)

        # Разделительная черта
        line = QFrame()
        line.setFrameShape(QFrame.HLine)
        line.setFrameShadow(QFrame.Sunken)
        layout.addWidget(line)

        # Случайный расклад и кнопка
        random_layout = QHBoxLayout()
        self.random_checkbox = QCheckBox("Случайный расклад на поле")
        random_button = QPushButton("Применить и отправить боту")
        random_button.clicked.connect(self.apply_and_send_random_config)
        random_layout.addWidget(self.random_checkbox)
        random_layout.addWidget(random_button)
        layout.addLayout(random_layout)

        self.edit_tab.setLayout(layout)

    def create_view_tab(self):
        layout = QVBoxLayout()

        # Кнопка "Получить текущую конфигурацию"
        get_config_button = QPushButton("Получить текущую конфигурацию")
        get_config_button.clicked.connect(self.get_configuration)
        layout.addWidget(get_config_button)

        # Радиокнопки для выбора конфигурации в строку
        radio_layout = QHBoxLayout()
        self.radio_buttons = []
        for i in [1, 3, 5, 7]:
            radio_button = QRadioButton(f"Конфигурация для {i}")
            self.radio_buttons.append(radio_button)
            radio_layout.addWidget(radio_button)
        layout.addLayout(radio_layout)

        # Сетка 5x5 из label'ов для визуализации конфигурации
        self.labels_grid = QGridLayout()
        self.labels = []
        for i in range(5):
            for j in range(5):
                label = QLabel()
                label.setStyleSheet("background-color: white; border: 1px solid black;")
                label.setFixedSize(30, 30)
                self.labels.append(label)
                self.labels_grid.addWidget(label, i, j)
        layout.addLayout(self.labels_grid)

        self.view_tab.setLayout(layout)

    # Обработчик для кнопки "Сохранить конфигурацию"
    def save_configuration(self):
        selected_positions = []
        for index, checkbox in enumerate(self.checkboxes):
            if checkbox.isChecked():
                row = index // 5 + 1
                col = index % 5 + 1
                selected_positions.append(f"{row}-{col}")

        config = {str(len(selected_positions)): selected_positions}

        # Отправка POST-запроса
        try:
            response = requests.post("https://minessoftwebapp.ru/update_config", json=config)
            if response.status_code == 200:
                self.show_message("Успех", "Конфигурация успешно сохранена!")
            else:
                self.show_message("Ошибка", f"Ошибка при отправке конфигурации: {response.status_code}")
        except Exception as e:
            self.show_message("Ошибка", f"Ошибка при отправке запроса: {e}")

    # Обработчик для кнопки "Получить текущую конфигурацию"
    def get_configuration(self):
        try:
            response = requests.get("https://minessoftwebapp.ru/get_config")
            if response.status_code == 200:
                config = response.json()
                self.update_labels(config)
            else:
                self.show_message("Ошибка", f"Ошибка при получении конфигурации: {response.status_code}")
        except Exception as e:
            self.show_message("Ошибка", f"Ошибка при выполнении запроса: {e}")

    def update_labels(self, config):
        # Сброс всех label'ов на белый цвет
        for label in self.labels:
            label.setStyleSheet("background-color: white; border: 1px solid black;")

        # Определение выбранной конфигурации
        selected_config = None
        for i, button in enumerate(self.radio_buttons):
            if button.isChecked():
                selected_config = str([1, 3, 5, 7][i])

        if selected_config and selected_config in config:
            positions = config[selected_config]
            for position in positions:
                row, col = map(int, position.split('-'))
                index = (row - 1) * 5 + (col - 1)
                self.labels[index].setStyleSheet("background-color: yellow; border: 1px solid black;")

    # Обработчик для кнопки "Применить и отправить боту"
    def apply_and_send_random_config(self):
        random_config = self.random_checkbox.isChecked()
        data = {"random_config": random_config}

        # Отправка POST-запроса
        try:
            response = requests.post("https://minessoftwebapp.ru/set_random_config", json=data)
            if response.status_code == 200:
                self.show_message("Успех", "Конфигурация успешно отправлена боту!")
            else:
                self.show_message("Ошибка", f"Ошибка при отправке конфигурации: {response.status_code}")
        except Exception as e:
            self.show_message("Ошибка", f"Ошибка при отправке запроса: {e}")

    def show_message(self, title, message):
        msg = QMessageBox()
        msg.setIcon(QMessageBox.Information)
        msg.setWindowTitle(title)
        msg.setText(message)
        msg.exec_()


if __name__ == "__main__":
    app = QApplication(sys.argv)
    main_win = MainWindow()
    main_win.show()
    sys.exit(app.exec_())

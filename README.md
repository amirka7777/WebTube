# 🚀 БЮРО 1440 — WebTube Platform

Веб-платформа для онлайн-трансляций и интерактивного взаимодействия с пользователями в реальном времени. Проект представляет собой полноценное Full-Stack приложение с авторизацией по JWT-токенам, встроенным видеоплеером и интерактивным чатом.

---

## 🛠 Технологический стек

* **Frontend:** React (Vite), React Router DOM, Axios.
* **Backend:** Python 3, Flask, Flask-SQLAlchemy, Flask-JWT-Extended, Flask-CORS.
* **База данных:** SQLite (автономная БД в файле `platform.db`).

---

## 🚀 Пошаговое руководство по запуску

Для полноценной работы платформы необходимо параллельно запустить два сервера: бэкенд (Flask) и фронтенд (Vite). Откройте два отдельных терминала и следуйте инструкциям ниже.

### Шаг 1. Запуск Бэкенда (Flask)

1. Откройте первый терминал и перейдите в папку с бэкендом:
   ```bash
   cd backend
   pip install flask flask-sqlalchemy flask-jwt-extended flask-cors
   python3 app.py
2. Перейдите в папку фронта и запустите его:
    ```bash
    cd frontend
    npm install
    npm run dev
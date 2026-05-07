# kr_web — каталог и продажа автомобилей (курсовая)

Монорепозиторий с двумя частями:

- **`backend/`** — Django + Django REST Framework API (JWT-аутентификация), хранение медиа, SQLite по умолчанию.
- **`front/`** — React + Vite + Tailwind (UI, каталог, карточка авто, админ-панель/дашборд).

## Быстрый старт (Windows)

### 1) Backend (Django API)

Требования: **Python 3.x**, `pip`.

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

# (опционально) если база/миграции не совпадают
python manage.py migrate

python manage.py runserver
```

По умолчанию сервер: `http://127.0.0.1:8000/`

Полезные адреса:
- **Админка**: `http://127.0.0.1:8000/admin/`
- **API (роутер cars-приложения)**: `http://127.0.0.1:8000/api/`
- **JWT**:
  - получить токены: `POST http://127.0.0.1:8000/api/token/`
  - обновить access: `POST http://127.0.0.1:8000/api/token/refresh/`

Авторизация на фронте/в запросах:
- Заголовок **`Authorization: Bearer <access_token>`**
- Права по умолчанию: **`IsAuthenticatedOrReadOnly`** (читать можно всем, создавать/менять — только с токеном).

Медиа:
- Загружаемые изображения обслуживаются в `DEBUG=True` по `MEDIA_URL=/media/` из папки `backend/media/`.

### 2) Frontend (React/Vite)

Требования: **Node.js 18+** (у вас в системе Node `v22+` — подходит), `npm`.

```bash
cd front
npm install
npm run dev
```

По умолчанию: `http://localhost:5173/`

Важно:
- Бэкенд CORS уже разрешает `http://localhost:5173` (и ещё несколько портов в `backend/core/settings.py`).
- Базовый URL API на фронте захардкожен в `front/src/api.js` как `http://127.0.0.1:8000/api/`.
- В `front/index.html` подключён скрипт 2GIS (`maps.api.2gis.ru`) для карты.

## Основные API-эндпоинты

Базовый префикс: **`/api/`**

Роутер (`backend/cars/urls.py`):
- **Авто**: `GET/POST /api/cars/`, `GET/PATCH/PUT/DELETE /api/cars/{id}/`
- **Марки**: `GET /api/brands/`, `GET /api/brands/{id}/`
- **Модели**: `GET /api/carmodels/`, `GET /api/carmodels/{id}/`

JWT:
- `POST /api/token/` — логин (username/password) → `access`, `refresh` + поля `is_staff`, `username`
- `POST /api/token/refresh/` — refresh → новый `access`

### Пагинация, фильтры, поиск и сортировка (cars)

Пагинация:
- `GET /api/cars/?page=1`
- `GET /api/cars/?page=1&page_size=24` (есть ограничение `max_page_size=1000`)

Фильтры (см. `backend/cars/filters.py`):
- `min_price`, `max_price`
- `min_year`, `max_year`
- `brand_name` (точное совпадение без учёта регистра)

Поиск/сортировка (см. `backend/cars/views.py`):
- `search=` по полям: бренд/модель/описание
- `ordering=` по: `price`, `year`, `mileage` (пример: `ordering=-price`)

## Структура проекта

```text
kr_web/
  backend/            # Django API + медиа + sqlite
    core/             # settings/urls/asgi/wsgi
    cars/             # модели/вьюсеты/фильтры/сериализаторы
    media/            # загруженные изображения
    db.sqlite3        # БД по умолчанию (dev)
  front/              # React/Vite приложение
    src/              # страницы/компоненты/api
```

## Скрипты

Frontend (`front/package.json`):
- `npm run dev` — dev-сервер
- `npm run build` — сборка
- `npm run preview` — предпросмотр сборки
- `npm run lint` — ESLint

Backend:
- `python manage.py runserver` — dev-сервер
- `python manage.py migrate` — миграции
- `python manage.py createsuperuser` — админ-пользователь


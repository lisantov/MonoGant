# MonoGant

Проект в рамках 24-часового `re:actionstack` хакатона. Гант-чат для управления задачами и спринтами в проектах.

## Стек

| Слой | Технологии |
|------|-----------|
| Frontend | Vue 3.5 (Composition API), TypeScript, Vite 7, Pinia 3, Pinia Colada, Tailwind CSS 4, vee-validate + Zod, Axios, Vueuse-core, Maska |
| Backend | Laravel 13 (PHP 8.5), Sanctum (аутентификация), Pest (тесты) |
| БД | PostgreSQL 17 |
| Контейнеризация | Docker Compose (nginx, backend, database, frontend) |

## Структура проекта

```
MonoGant/
├── backend/          # Laravel 13 API
├── deploy/           # Конфигурация деплоя
├── CollectionApi/    # OpenAPI-спецификация API (YML)
├── docker-compose.yml
└── frontend/         # Vue 3 приложение
    └── src/
        ├── app/          # Entry point, роутер, лейауты (DefaultLayout, EmptyLayout)
        ├── pages/        # Маршруты: home, login, register, main, gantt, not-found
        ├── widgets/      # Композитные блоки (gantt-chart, modals, header, widget)
        ├── features/     # User-фичи: auth, task, sprint, project, change-password, change-profile
        ├── entities/     # Доменные сущности: task, sprint, comment, account
        ├── shared/       # Общие: UI-компоненты, composables, валидации, API-инстанс, типы
        └── assets/       # CSS, шрифты, иконки, изображения
```

Архитектура фронтенда основана на **Feature-Sliced Design** (FSD).

### Маршруты

| Путь | Страница | Защита |
|------|----------|--------|
| `/` | Проекты (main) | `auth` |
| `/home` | Home | публичная |
| `/login` | Вход | публичная |
| `/register` | Регистрация | публичная |
| `/gantt/:id` | Гант-чарт проекта | `auth` |

## Запуск

### Docker (рекомендуется)

```bash
cp backend/.env.example backend/.env
ln -s backend/.env .env
docker compose up -d
docker exec backend php artisan migrate:fresh
```

Приложение будет доступно по адресам, указанным в `docker-compose.yml` (обычно `localhost`).

### Frontend (локальная разработка)

```bash
cd frontend
npm install
npm run dev        # Vite dev-сервер
npm run build      # Production-сборка (vue-tsc + vite build)
npm run preview    # Предпросмотр production-сборки
```

### Тесты

```bash
cd frontend
npm run test       # Vitest (unit-тесты, без DOM-окружения)
npm run test:watch # Vitest в watch-режиме
```

### Статический анализ

```bash
cd frontend
npm run lint       # ESLint с автофиксацией
npm run format     # Prettier
npm run type-check # Vue-tsc проверка типов
```

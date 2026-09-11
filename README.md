# MonoGant

Проект в рамках 24-часового ```re:actionstack``` хакатона

Запуск проекта:

Заполните `.env` в `backend` (для работы с докером уже все готово).

```shell
cp backend/.env.example backend/.env
```

```shell
ln -s backend/.env .env
docker compose up -d
docker exec backend php artisan migrate:fresh
```
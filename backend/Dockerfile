FROM php:8.5-cli

RUN apt-get update     && apt-get install -y --no-install-recommends libpq-dev libicu-dev libzip-dev libonig-dev unzip git     && docker-php-ext-install pdo_pgsql mbstring intl zip     && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader --no-scripts     && chown -R www-data:www-data storage bootstrap/cache     && chmod -R 775 storage bootstrap/cache

EXPOSE 8000

CMD ["sh", "-c", "php artisan storage:link --force || true; php artisan migrate --force; exec php -S 0.0.0.0:8000 -t public"]

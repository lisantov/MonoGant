FROM php:8.5-apache

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN apt-get update     && apt-get install -y --no-install-recommends libpq-dev libicu-dev libzip-dev libonig-dev unzip git     && docker-php-ext-install pdo_pgsql mbstring intl zip     && rm -f /etc/apache2/mods-enabled/mpm_*.load /etc/apache2/mods-enabled/mpm_*.conf     && a2enmod mpm_prefork rewrite     && sed -ri -e "s!/var/www/html!$APACHE_DOCUMENT_ROOT!g" /etc/apache2/sites-available/*.conf /etc/apache2/apache2.conf     && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader --no-scripts     && chown -R www-data:www-data storage bootstrap/cache     && chmod -R 775 storage bootstrap/cache

EXPOSE 80

CMD ["sh", "-c", "rm -f /etc/apache2/mods-enabled/mpm_*.load /etc/apache2/mods-enabled/mpm_*.conf; a2enmod mpm_prefork rewrite >/dev/null 2>&1 || true; php artisan storage:link --force || true; php artisan migrate --force; exec apache2-foreground"]

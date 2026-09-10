FROM php:8.5-fpm-alpine3.23 AS builder

RUN apk add --no-cache \
    postgresql-dev \
    icu-dev \
    libxml2-dev \
    oniguruma-dev \
    libzip-dev

RUN docker-php-ext-install -j$(nproc) \
    pdo_pgsql \
    mbstring \
    intl \
    zip

FROM php:8.5-fpm-alpine3.23 AS runtime

RUN apk update && apk upgrade --no-cache && \
    apk del --no-cache curl tar && \
    apk add --no-cache \
    postgresql-libs \
    icu-libs \
    libxml2 \
    oniguruma \
    libzip

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

COPY --from=builder /usr/local/lib/php/extensions /usr/local/lib/php/extensions
COPY --from=builder /usr/local/etc/php/conf.d /usr/local/etc/php/conf.d

WORKDIR /var/www

RUN mkdir -p /var/www/storage /var/www/bootstrap/cache \
    && chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache

COPY ./backend/.env /var/www/.env

COPY ./backend/composer.json ./backend/composer.lock* /var/www/
COPY ./deploy/php/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 9000
CMD ["php-fpm"]
ENTRYPOINT ["entrypoint.sh"]

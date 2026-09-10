#!/bin/sh
set -e

chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

cd /var/www
#composer install --optimize-autoloader --no-interaction --no-progress
php artisan key:generate --force
php artisan migrate:fresh --seed --force
php artisan storage:link --force

exec "$@"

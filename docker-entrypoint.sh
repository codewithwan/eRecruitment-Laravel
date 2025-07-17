#!/bin/sh
set -e

# Copy .env.example to .env if .env doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
fi

# Update APP_URL if provided
if [ ! -z "$APP_URL" ]; then
    echo "Setting APP_URL to $APP_URL..."
    sed -i "s#APP_URL=.*#APP_URL=$APP_URL#" .env
    
    # Force HTTPS to fix mixed content issues
    if [[ "$APP_URL" == https://* ]]; then
        echo "HTTPS detected, setting FORCE_HTTPS to true..."
        sed -i "s/FORCE_HTTPS=.*/FORCE_HTTPS=true/" .env
        # If not present, add it
        if ! grep -q "FORCE_HTTPS=" .env; then
            echo "FORCE_HTTPS=true" >> .env
        fi
        # Set asset URL to match APP_URL for vite assets
        if ! grep -q "ASSET_URL=" .env; then
            echo "ASSET_URL=$APP_URL" >> .env
        else
            sed -i "s#ASSET_URL=.*#ASSET_URL=$APP_URL#" .env
        fi
    fi
fi

# Generate application key if not set
php artisan key:generate --no-interaction --force

# Create storage symlink
echo "Creating storage symlink..."
php artisan storage:link --force

# Wait for database connection
echo "Waiting for database to be ready..."
max_tries=30
count=0
while [ $count -lt $max_tries ]; do
    if php artisan db:monitor > /dev/null 2>&1; then
        echo "Database connection successful!"
        break
    fi
    count=$((count + 1))
    echo "Waiting for database (attempt $count/$max_tries)..."
    sleep 3
done

if [ $count -eq $max_tries ]; then
    echo "Could not connect to database after $max_tries attempts."
    echo "Continuing with startup anyway..."
fi

# Run migrations
php artisan migrate --no-interaction --force

# Run seeders
echo "Running database seeders..."
php artisan db:seed --no-interaction --force

# Clear cache to apply new environment settings
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Start FrankenPHP
exec frankenphp run --config /etc/caddy/Caddyfile 
FROM dunglas/frankenphp:latest-php8.3-alpine

WORKDIR /var/www/html

# Install dependencies and extensions
RUN apk add --no-cache \
    libpng-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    nodejs \
    npm \
    && apk add --no-cache $PHPIZE_DEPS \
    && docker-php-ext-install pdo pdo_mysql zip gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copy only the composer files first
COPY composer.json composer.lock ./

# Install dependencies
RUN composer install --no-scripts --no-autoloader

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install npm dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Generate autoloader
RUN composer dump-autoload --optimize

# Build React assets with Vite
RUN npm run build

# Set permissions
RUN chmod -R 777 storage bootstrap/cache
RUN mkdir -p storage/app/public/evidence
RUN chmod -R 777 storage/app/public

# Create a simple Caddyfile directly
COPY Caddyfile /etc/caddy/Caddyfile

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port 8080
EXPOSE 8080

# Set the entrypoint
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

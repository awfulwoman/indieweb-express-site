#!/bin/bash

APPDIR=$1
cd $APPDIR

echo "Copying env vars..."
# cp ../.env .env

echo "Remove existing node_modules..."
rm -rf node_modules

echo "Building app..."
npm ci

# Build assets like Sass


# pm2 restart app
pm2 start ecosystem.config.js
pm2 save
pm2 startup
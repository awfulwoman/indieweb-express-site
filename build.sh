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
# pm2 stop all
pm2 save
pm2 restart ecosystem.config.js
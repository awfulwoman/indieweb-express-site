#!/bin/bash

APPDIR=$1
cd $APPDIR

echo "Copying env vars..."
# cp ../.env .env

echo "Remove existing node_modules..."
rm -rf node_modules

echo "Building app..."
npm ci

# Build assets

npm run build:css

# Handle server process

pm2 stop ecosystem.config.js
pm2 delete ecosystem.config.js
pm2 start ecosystem.config.js
pm2 save
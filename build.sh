#!/bin/bash

APPDIR=$1
cd $APPDIR

echo "Remove existing node_modules..."
rm -rf node_modules

echo "Building app..."
npm ci

echo "Building assets..."
npm run css

echo "Restarting server process..."
pm2 stop ecosystem.config.js
pm2 delete ecosystem.config.js
pm2 start ecosystem.config.js
pm2 save
#!/bin/bash

APPDIR=$1
cd $APPDIR

echo "Building app..."
npm ci

echo "Building assets..."
npm run css
npm run sprites
npm run js

echo "Restarting server process..."
pm2 stop ecosystem.config.js
pm2 delete ecosystem.config.js
pm2 start ecosystem.config.js
pm2 save

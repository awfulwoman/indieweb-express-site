#!/bin/bash

APPDIR=$1
cd $APPDIR

docker-compose stop
docker-compose -f docker-compose.yml -f docker-compose.production.yml up -d


# echo "Building app..."
# rm -rf node_modules
# npm ci

# echo "Building assets..."
# npm run css
# npm run sprites
# npm run js

# echo "Restarting server process..."
# pm2 stop ecosystem.config.js
# pm2 delete ecosystem.config.js
# pm2 start ecosystem.config.js
# pm2 save

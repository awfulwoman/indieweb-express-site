#!/bin/bash

echo 'Copying env vars...'

cd $APP_DIR
pwd
cp ../.env .env

echo 'Building app...'

# Install dependencies
npm ci

# Build assets like Sass
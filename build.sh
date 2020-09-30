#!/bin/bash

echo 'Copying env vars...'
echo APP dir is $APP_DIR
cd $APP_DIR
pwd
cp ../.env .env

echo 'Building app...'

# Install dependencies
npm ci

# Build assets like Sass
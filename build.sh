#!/bin/bash

echo 'Copying env vars...'
cd $SERVER_DIR
cp ../.env .env

echo 'Building app...'

# Install dependencies
npm ci

# Build assets like Sass
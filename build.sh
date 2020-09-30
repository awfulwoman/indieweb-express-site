#!/bin/bash

echo 'Copying env vars...'
cp ../.env .env

echo 'Building app...'

# Install dependencies
npm i

# Build assets like Sass
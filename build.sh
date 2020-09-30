#!/bin/bash

APPDIR=$1

echo "Copying env vars..."
echo "APPDIR is $APPDIR and nothing else"
cd $APPDIR
pwd
cp ../.env .env

echo "Building app..."

# Install dependencies
npm ci

# Build assets like Sass
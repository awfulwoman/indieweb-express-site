#!/bin/bash

echo "Copying env vars..."
echo "APPDIR is $APPDIR and nothing else"
echo "BUILDENV is $BUILDENV"
cd $APPDIR
pwd
cp ../.env .env

echo "Building app..."

# Install dependencies
npm ci

# Build assets like Sass
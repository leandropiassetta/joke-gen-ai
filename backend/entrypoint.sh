#!/bin/sh
set -e

echo "🚀 Running database migrations..."
node build/bin/console.js migration:run --force

echo "✅ Migrations completed."

echo "🚀 Starting AdonisJS server..."
node build/bin/server.js

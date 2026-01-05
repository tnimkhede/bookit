#!/bin/bash

# Database Setup Script for Appointment Backend
# This script creates the PostgreSQL database and sets up the user

echo "🔧 Setting up PostgreSQL database..."
echo ""

# Create database
echo "Creating database 'appointement'..."
sudo -u postgres createdb appointement

# Set postgres user password
echo "Setting postgres user password..."
sudo -u postgres psql -c "ALTER USER postgres PASSWORD '123456';"

echo ""
echo "✅ Database setup complete!"
echo ""
echo "You can now run: npm run init-db"

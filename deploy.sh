#!/bin/bash

# Deploy script for Paddy project
# This script pulls the latest changes, rebuilds backend and frontend, and restarts PM2 processes

echo "Starting deployment..."

# Pull latest changes
echo "Pulling latest changes from git..."
git pull origin main

# Backend
echo "Updating backend..."
cd backend
npm ci
npm run build
cd ..

# Frontend
echo "Updating frontend..."
cd frontend
npm ci
npm run build
cd ..

# Restart PM2 processes
echo "Restarting PM2 processes..."
pm2 restart ecosystem.config.js

echo "Deployment completed successfully!"
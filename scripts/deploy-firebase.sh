#!/bin/bash

# Firebase Deployment Script
# This script builds and deploys Firebase Functions

echo "🚀 Starting Firebase Functions deployment..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Navigate to functions directory and install dependencies
echo "📦 Installing Functions dependencies..."
cd functions
npm install

# Build the functions
echo "🔨 Building Functions..."
npm run build

# Return to root directory
cd ..

# Deploy to Firebase
echo "🚀 Deploying to Firebase..."
firebase deploy --only functions

echo "✅ Deployment complete!"
echo "📝 View your functions at: https://console.firebase.google.com/project/your-project-id/functions"
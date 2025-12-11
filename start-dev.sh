#!/bin/bash

# Quick start script for development (without MongoDB)
# This creates a mock server that shows the setup is correct

echo "🚀 Starting Smart Chatbot Management System..."
echo ""
echo "⚠️  This is a development check script"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please run ./setup.sh first"
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "❌ Dependencies not installed. Please run: npm install"
    exit 1
fi

echo "✅ Environment file exists"
echo "✅ Dependencies installed"
echo ""

# Check MongoDB URL in .env
if grep -q "mongodb+srv://username:password" .env || grep -q "localhost:27017" .env; then
    echo "⚠️  MongoDB connection string needs to be updated in .env file"
    echo ""
    echo "Options:"
    echo "  1. Use MongoDB Atlas (recommended):"
    echo "     - Sign up at https://www.mongodb.com/cloud/atlas"
    echo "     - Create a cluster and get connection string"
    echo "     - Update MONGO_URI in .env"
    echo ""
    echo "  2. Use Local MongoDB:"
    echo "     - Install MongoDB on your system"
    echo "     - Start MongoDB service"
    echo "     - Update MONGO_URI=mongodb://localhost:27017/student-chatbot"
    echo ""
fi

echo "📖 To start the server:"
echo "   npm run dev    (development mode with auto-restart)"
echo "   npm start      (production mode)"
echo ""
echo "📚 For more information, see README.md"

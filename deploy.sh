#!/bin/bash

# Food Quality Inspection App - Deployment Script
# This script helps deploy all components of the application

echo "=== Food Quality Inspection App Deployment ==="
echo "This script will guide you through deploying the application."
echo ""

# Check if running on Linux/Unix system
if [[ "$OSTYPE" != "linux-gnu"* && "$OSTYPE" != "darwin"* ]]; then
    echo "Warning: This script is designed for Linux/macOS systems."
    echo "On Windows, please follow the manual deployment instructions in README.md"
    echo ""
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "Checking prerequisites..."
if ! command_exists node; then
    echo "Error: Node.js is not installed. Please install Node.js v18+"
    exit 1
fi

if ! command_exists npm; then
    echo "Error: npm is not installed. Please install npm"
    exit 1
fi

echo "Node.js and npm found."
echo ""

# Ask user which component to deploy
echo "Which component would you like to deploy?"
echo "1) Backend API only"
echo "2) Web Dashboard only"
echo "3) Both Backend and Web Dashboard"
echo "4) Show deployment instructions"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo "Deploying Backend API..."
        cd backend
        
        echo "Installing dependencies..."
        npm install
        
        echo "Building application..."
        npm run build
        
        echo "Backend deployment preparations complete."
        echo "Remember to:"
        echo "1. Set up your production database"
        echo "2. Configure environment variables"
        echo "3. Run database migrations"
        echo "4. Set up process manager (PM2) and reverse proxy (nginx)"
        echo "See README.md for detailed instructions."
        ;;
    2)
        echo "Deploying Web Dashboard..."
        cd web
        
        echo "Installing dependencies..."
        npm install
        
        echo "Building application..."
        npm run build
        
        echo "Web dashboard build complete."
        echo "Remember to:"
        echo "1. Deploy the .next directory to your hosting provider"
        echo "2. Set up reverse proxy (nginx) if self-hosting"
        echo "3. Configure environment variables"
        echo "See README.md for detailed instructions."
        ;;
    3)
        echo "Deploying both Backend and Web Dashboard..."
        
        echo "Deploying Backend API..."
        cd backend
        npm install
        npm run build
        cd ..
        
        echo "Deploying Web Dashboard..."
        cd web
        npm install
        npm run build
        cd ..
        
        echo "Both components built successfully."
        echo "Remember to deploy each component according to the instructions in README.md"
        ;;
    4)
        echo "Showing deployment instructions..."
        echo "Please refer to the README.md file for detailed deployment instructions:"
        echo ""
        cat README.md | sed -n '/## Deployment/,/## Contributing/p' | head -n -1
        ;;
    *)
        echo "Invalid choice. Please run the script again and select a valid option."
        exit 1
        ;;
esac

echo ""
echo "Deployment script completed."
echo "For detailed deployment instructions, please refer to README.md"
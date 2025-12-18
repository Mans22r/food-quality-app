#!/bin/bash

# Setup production environment variables for backend
# This script creates a .env.production file with placeholders

echo "Setting up production environment variables..."

# Create .env.production file
cat > .env.production << EOF
# === PRODUCTION ENVIRONMENT VARIABLES ===

# Database Configuration
# Update with your actual database credentials
DATABASE_URL="postgresql://username:password@host:port/database_name?schema=public"

# JWT Configuration
# Generate strong secrets for production
JWT_SECRET="your-production-jwt-secret-here"
JWT_REFRESH_SECRET="your-production-refresh-secret-here"

# CORS Configuration
# Update with your actual frontend domain
CORS_ORIGIN="https://your-dashboard-domain.com"

# Port Configuration
PORT=5001

# Optional: OpenAI API Key for AI features
# OPENAI_API_KEY="your-openai-api-key"

# Auth0 Configuration (if using)
# AUTH0_SECRET="your-auth0-secret"
# AUTH0_ISSUER_BASE_URL="your-auth0-issuer"
# AUTH0_CLIENT_ID="your-auth0-client-id"
# AUTH0_CLIENT_SECRET="your-auth0-client-secret"
EOF

echo ".env.production file created successfully!"
echo ""
echo "IMPORTANT: Please update the placeholders in .env.production with your actual values:"
echo "1. Database credentials"
echo "2. JWT secrets (generate strong secrets)"
echo "3. CORS origin (your frontend domain)"
echo "4. Auth0 configuration (if applicable)"
echo ""
echo "To generate strong JWT secrets, you can use:"
echo "node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
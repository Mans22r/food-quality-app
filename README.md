# Food Quality Inspection App

A comprehensive food quality inspection application with backend API, web dashboard, and mobile inspection app.

## Project Structure

```
food-quality-app/
├── backend/          # Node.js Express API with Prisma ORM
├── web/              # Next.js web dashboard
├── mobile/           # React Native mobile inspection app
```

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- Expo CLI (for mobile development)

## Setup Instructions

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials and other settings
```

Run database migrations:
```bash
npx prisma migrate dev
```

Seed the database (optional):
```bash
npx prisma db seed
```

Start the development server:
```bash
npm run dev
```

The backend API will be available at `http://localhost:3001`.

### 2. Web Dashboard Setup

Navigate to the web directory:
```bash
cd web
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The web dashboard will be available at `http://localhost:3000`.

### 3. Mobile App Setup

Navigate to the mobile app directory:
```bash
cd mobile/FoodQualityInspector
```

Install dependencies:
```bash
npm install
```

Start the Expo development server:
```bash
npm start
```

This will open the Expo DevTools in your browser. From there, you can:
- Scan the QR code with the Expo Go app on your phone
- Run on iOS simulator (requires Xcode)
- Run on Android emulator (requires Android Studio)

## Running All Services Together

From the root directory, you can start both backend and web services simultaneously:
```bash
npm run dev
```

Note: The mobile app needs to be started separately using the Expo CLI.

## Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-jwt-secret-key"
OPENAI_API_KEY="your-openai-api-key" # Optional, for AI-powered features
```

## Database Schema

The application uses Prisma ORM with PostgreSQL. The database schema includes:
- Users (with roles: admin, inspector, manager, kitchen_manager, hotel_manager)
- Forms (inspection forms)
- Guidelines (food safety guidelines)
- Reports (inspection reports)
- Audits (audit trail)

## API Documentation

API documentation is available at `http://localhost:3001/api-docs` when the backend server is running.

## Deployment

To deploy this application to a live environment, you'll need to set up hosting for each component and configure them to work together.

### Prerequisites for Deployment

1. A server/VPS with Node.js installed (Ubuntu 20.04+ recommended)
2. PostgreSQL database (can be hosted separately or on the same server)
3. Domain names for your backend API and web dashboard
4. SSL certificates for secure HTTPS connections
5. For mobile app distribution: Google Play Store and Apple App Store accounts

### 1. Backend Deployment

#### Quick Deployment Scripts
The project includes helper scripts to simplify deployment:
- `deploy.sh` in the root directory for general deployment guidance
- `setup-env.sh` in the backend directory to create a template .env.production file
- `ecosystem.config.js` for PM2 process management

#### Server Setup
1. Set up a server with Ubuntu 20.04+ or similar Linux distribution
2. Install Node.js (v18+) and PostgreSQL
3. Configure firewall to allow ports 80, 443, and your API port (default 5001)
#### Database Setup
1. Install PostgreSQL:
   ```bash
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   ```

2. Create database and user:
   ```bash
   sudo -u postgres psql
   CREATE DATABASE food_quality_app;
   CREATE USER food_user WITH ENCRYPTED PASSWORD 'strong_password';
   GRANT ALL PRIVILEGES ON DATABASE food_quality_app TO food_user;
   \q
   ```

#### Application Deployment
1. Clone or transfer your application to the server:
   ```bash
   git clone <your-repo-url> /var/www/food-quality-app
   cd /var/www/food-quality-app/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env.production` file with your production settings:
   ```
   # Database Configuration
   DATABASE_URL="postgresql://food_user:strong_password@localhost:5432/food_quality_app?schema=public"
   
   # JWT Configuration
   JWT_SECRET="your-production-jwt-secret"
   JWT_REFRESH_SECRET="your-production-refresh-secret"
   
   # CORS Configuration (your web dashboard domain)
   CORS_ORIGIN=https://your-dashboard-domain.com
   
   # Port Configuration
   PORT=5001
   ```

4. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```

5. Seed the database (optional):
   ```bash
   npx prisma db seed
   ```

6. Build the application:
   ```bash
   npm run build
   ```

7. Set up process management with PM2:
   ```bash
   npm install -g pm2
   # Option 1: Simple start
   pm2 start dist/server.js --name "food-quality-backend"
   
   # Option 2: Use the provided ecosystem file (recommended)
   # pm2 start ecosystem.config.js --env production
   
   pm2 startup
   pm2 save
   ```
8. Configure nginx as a reverse proxy:
   Create `/etc/nginx/sites-available/food-api`:
   ```nginx
   server {
       listen 80;
       server_name your-api-domain.com;
       
       location / {
           proxy_pass http://localhost:5001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/food-api /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

9. Set up SSL with Let's Encrypt:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-api-domain.com
   ```

### 2. Web Dashboard Deployment

#### Using Vercel (Recommended)
1. Sign up for a Vercel account
2. Connect your GitHub/GitLab repository
3. Configure environment variables in Vercel dashboard:
   - NEXT_PUBLIC_API_URL=https://your-api-domain.com/api

#### Using Traditional Hosting
1. Build the application:
   ```bash
   cd web
   npm install
   npm run build
   ```

2. Serve the static files using nginx:
   Create `/etc/nginx/sites-available/food-dashboard`:
   ```nginx
   server {
       listen 80;
       server_name your-dashboard-domain.com;
       root /var/www/food-quality-app/web/.next/standalone;
       index index.html;
       
       location / {
           try_files $uri $uri/ @fallback;
       }
       
       location @fallback {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```
   
   Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/food-dashboard /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

3. Set up SSL with Let's Encrypt:
   ```bash
   sudo certbot --nginx -d your-dashboard-domain.com
   ```

### 3. Mobile App Deployment

#### For Internal Distribution
1. Build standalone APK/IPA:
   ```bash
   cd mobile/FoodQualityInspector
   expo build:android
   expo build:ios
   ```

#### For App Store Distribution
1. Prepare for store submission:
   - Create app icons and splash screens
   - Update app.json with store metadata
   - Ensure all permissions are properly explained
   - Test thoroughly on multiple devices

2. Submit to stores:
   - Google Play Console for Android
   - Apple App Store Connect for iOS

### Post-Deployment Checklist

1. Verify all services are running:
   - API health check: `curl https://your-api-domain.com/health`
   - Web dashboard loads correctly
   - Mobile app connects to the API

2. Test all user roles and permissions
3. Verify database backups are configured
4. Monitor application logs
5. Set up error tracking (e.g., Sentry)
6. Configure monitoring and alerting

### Maintenance

1. Regular security updates for server packages
2. Database backups (daily/weekly depending on requirements)
3. Monitoring application performance
4. Updating dependencies regularly
5. Reviewing and rotating API keys and secrets periodically

### Scaling Considerations

1. For high traffic:
   - Use load balancers
   - Implement database read replicas
   - Use CDN for static assets
   - Consider microservices architecture for large scale

2. Backup strategy:
   - Automated daily database backups
   - Store backups in multiple locations
   - Regular restore testing

This deployment approach will give you a production-ready system that can be used by your clients.
## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
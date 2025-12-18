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

### Backend
```bash
cd backend
npm run build
npm start
```

### Web Dashboard
```bash
cd web
npm run build
npm start
```

### Mobile App
Build the app for production:
```bash
cd mobile/FoodQualityInspector
expo build:android  # for Android
expo build:ios      # for iOS
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
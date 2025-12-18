# Food Quality Inspection App - Deployment Checklist

This checklist ensures all components are properly deployed and configured for a production environment.

## Pre-Deployment Requirements

- [ ] Server/VPS provisioned with Ubuntu 20.04+ or similar Linux distribution
- [ ] Domain names registered for API and web dashboard
- [ ] SSL certificates obtained (Let's Encrypt or commercial)
- [ ] PostgreSQL database accessible
- [ ] Firewall configured to allow necessary ports (80, 443, API port)

## Backend API Deployment

### Server Setup
- [ ] Node.js (v18+) installed
- [ ] PostgreSQL installed and running
- [ ] Git installed
- [ ] PM2 installed globally (`npm install -g pm2`)
- [ ] Nginx installed (`sudo apt install nginx`)

### Application Setup
- [ ] Application code cloned/transfered to server
- [ ] Dependencies installed (`npm install`)
- [ ] Production environment variables configured in `.env.production`
- [ ] Database migrations run (`npx prisma migrate deploy`)
- [ ] Database seeded if needed (`npx prisma db seed`)
- [ ] Application built (`npm run build`)
- [ ] Application started with PM2 (`pm2 start dist/server.js`)
- [ ] PM2 startup configured (`pm2 startup` and `pm2 save`)

### Network Configuration
- [ ] Nginx reverse proxy configured for API
- [ ] SSL certificate installed for API domain
- [ ] Firewall allows traffic on ports 80, 443, and API port

## Web Dashboard Deployment

### Build Process
- [ ] Dependencies installed (`npm install`)
- [ ] Application built (`npm run build`)
- [ ] Environment variables configured (NEXT_PUBLIC_API_URL)

### Hosting Setup
- [ ] Files deployed to hosting provider or server
- [ ] Nginx configuration set up (if self-hosting)
- [ ] SSL certificate installed for dashboard domain
- [ ] DNS records pointing to server/hosting

## Mobile App Preparation

### For Internal Distribution
- [ ] Standalone APK built for Android
- [ ] Standalone IPA built for iOS
- [ ] App distributed to intended users

### For App Store Distribution
- [ ] App icons and splash screens created
- [ ] App metadata prepared
- [ ] Privacy policy prepared
- [ ] App submitted to Google Play Store
- [ ] App submitted to Apple App Store

## Post-Deployment Verification

### Functionality Tests
- [ ] API health endpoint accessible (`/health`)
- [ ] Web dashboard loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] All user roles can access appropriate features
- [ ] Form creation and submission works
- [ ] Report generation works
- [ ] Mobile app connects to API correctly

### Security Checks
- [ ] SSL certificates valid and properly configured
- [ ] API endpoints properly secured
- [ ] CORS configured correctly
- [ ] No sensitive information in client-side code

### Monitoring & Maintenance
- [ ] Application logs accessible
- [ ] Error tracking configured (e.g., Sentry)
- [ ] Database backup strategy implemented
- [ ] Monitoring alerts configured
- [ ] Contact information for maintenance support provided

## Client Handover

- [ ] Access credentials provided (with instructions to change)
- [ ] Documentation provided
- [ ] Training materials provided (if applicable)
- [ ] Support contact information provided
- [ ] Warranty/maintenance agreement details provided

---

Once all items are checked, the system is ready for production use.
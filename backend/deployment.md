# 🚀 Production Deployment Guide

## Pre-Deployment Checklist

### Security Fixes (CRITICAL)
- [ ] Apply all fixes from SECURITY_AUDIT_REPORT.md
- [ ] Update dependencies with new packages (helmet, express-rate-limit, express-validator, morgan)
- [ ] Implement input validation middleware
- [ ] Add rate limiting to authentication endpoints
- [ ] Remove JWT token from response body
- [ ] Fix email regex validation
- [ ] Add security headers (Helmet.js)

### Configuration
- [ ] Set `NODE_ENV=production`
- [ ] Generate strong `JWT_SECRET`: `openssl rand -base64 32`
- [ ] Configure HTTPS/SSL certificates
- [ ] Set up MongoDB connection pooling
- [ ] Configure CORS with production domain (not localhost)
- [ ] Set `COOKIE_DOMAIN` to your actual domain

### Environment Variables
```bash
# Copy and populate these values
NODE_ENV=production
SERVER_PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=<generated-secret>
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=<strong-password>
CLIENT_URL=https://yourdomain.com
COOKIE_DOMAIN=yourdomain.com
HTTPS_ENABLED=true
```

### Testing Before Deployment

1. **Local Testing**
```bash
# Install dependencies
npm install

# Run security audit
npm audit

# Start dev server
npm run dev
```

2. **Staging Environment**
- Deploy to staging first
- Test all authentication flows
- Test admin dashboard functionality
- Verify CORS settings
- Check rate limiting works
- Monitor error logs

3. **Performance Testing**
```bash
# Basic load testing
npm install -g artillery
artillery quick --count 100 --num 10 http://localhost:5000/api/health
```

---

## Step-by-Step Deployment

### Option 1: Vercel (Recommended for Node.js)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit with security fixes"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

2. **Connect to Vercel**
- Go to [vercel.com](https://vercel.com)
- Click "New Project"
- Import from GitHub repository
- Configure environment variables in Settings

3. **Environment Variables**
```
Add all variables from your .env file
```

4. **Deploy**
```bash
# Automatic deployment on push to main
# Manual deployment:
npm install -g vercel
vercel --prod
```

---

### Option 2: AWS EC2

1. **Create EC2 Instance**
   - Ubuntu 22.04 LTS
   - t3.medium or larger
   - Security group: Allow ports 80, 443, 22

2. **Install Dependencies**
```bash
sudo apt-get update
sudo apt-get install -y nodejs npm git nginx certbot python3-certbot-nginx

# Install Node version manager
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
```

3. **Deploy Application**
```bash
# Clone repository
git clone https://github.com/yourusername/your-repo.git
cd your-repo

# Install dependencies
npm install

# Create .env file
nano .env  # Add all environment variables

# Run production build/start
npm start
```

4. **Set Up PM2 (Process Manager)**
```bash
npm install -g pm2

# Start application
pm2 start server.js --name "portfolio-backend"

# Auto-restart on server reboot
pm2 startup
pm2 save
```

5. **Configure Nginx (Reverse Proxy)**
```bash
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

6. **Enable HTTPS**
```bash
sudo certbot --nginx -d yourdomain.com
sudo systemctl restart nginx
```

---

### Option 3: Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
    restart: always
```

Deploy:
```bash
docker-compose up -d
```

---

## Post-Deployment

### Monitoring

1. **Set Up Error Tracking**
```bash
npm install @sentry/node
```

```javascript
// In server.js
import * as Sentry from "@sentry/node";

Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
});
```

2. **Enable Request Logging**
```javascript
// In app.js
import morgan from 'morgan';

// Log to file in production
import fs from 'fs';
const accessLogStream = fs.createWriteStream('logs/access.log', { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
```

3. **Set Up Alerts**
   - Email alerts for errors
   - Slack notifications for deployment
   - Uptime monitoring (uptimerobot.com)

### Database Backups

```bash
# Automated MongoDB backup script
0 2 * * * mongodump --uri="mongodb+srv://..." --out=/backups/$(date +\%Y\%m\%d)
```

### Security Hardening

1. **Firewall Rules**
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

2. **SSL/TLS Configuration**
```bash
# Strong SSL configuration
sudo certbot install --nginx --redirect
```

3. **Automated Dependency Updates**
```bash
# Enable dependabot on GitHub
# Settings > Security & analysis > Enable Dependabot
```

---

## Troubleshooting

### Application Won't Start
```bash
# Check logs
pm2 logs portfolio-backend

# Check port is available
lsof -i :5000

# Check environment variables
cat .env
```

### Database Connection Issues
```bash
# Test MongoDB connection
mongosh "mongodb+srv://username:password@cluster.mongodb.net/database"

# Check connection string format
# Should be: mongodb+srv://username:password@host.mongodb.net/database
```

### CORS Errors
- Verify `CLIENT_URL` in environment variables
- Check `Origin` header in request matches `allowedOrigins`
- Ensure `credentials: true` is set in CORS config

### Rate Limiting Too Strict
- Adjust `windowMs` and `max` values in `app.js`
- Consider per-user limits instead of per-IP

---

## Rollback Procedure

If something goes wrong:

```bash
# Using Git
git revert <commit-hash>
git push origin main

# Using PM2
pm2 restart portfolio-backend

# Using Docker
docker-compose down
git checkout previous-version
docker-compose up -d
```

---

## Performance Optimization

1. **Enable Compression**
```javascript
import compression from 'compression';
app.use(compression());
```

2. **Database Query Optimization**
```javascript
// Add indexes to frequently queried fields
// In userModel.js:
inquirySchema.index({ email: 1 });
inquirySchema.index({ createdAt: -1 });
```

3. **Implement Caching**
```javascript
import redis from 'redis';
const redisClient = redis.createClient();
```

4. **Monitor Performance**
- Use New Relic or Datadog
- Monitor database query times
- Track response times

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] JWT_SECRET is strong (min 32 chars)
- [ ] Rate limiting configured
- [ ] CORS restricted to specific domain
- [ ] Helmet.js enabled
- [ ] Input validation on all routes
- [ ] Error messages don't expose internals
- [ ] Sensitive data not logged
- [ ] Database backups configured
- [ ] Monitoring and alerts set up
- [ ] Admin credentials changed from defaults
- [ ] Dependencies up to date (`npm audit`)

---

## Support & Escalation

For production issues:
1. Check error logs immediately
2. Run `npm audit` to identify vulnerabilities
3. Check MongoDB connection
4. Verify environment variables
5. Check disk space and memory
6. Contact your hosting provider if infrastructure issue

---

**Document Version:** 1.0  
**Last Updated:** June 30, 2026


---------------------------------------


# 🔧 Implementation Guide - Applying Security Fixes

This guide walks you through implementing all the security fixes from the audit report.

---

## Quick Start (30 minutes)

### Step 1: Install New Dependencies
```bash
npm install express-rate-limit express-validator helmet morgan
```

### Step 2: Update package.json
Compare your `package.json` with `FIXES/package.json.FIXED` and ensure you have:
- `express-rate-limit`
- `express-validator`
- `helmet`
- `morgan`

### Step 3: Update app.js
Replace your `src/app.js` with the fixed version from `FIXES/app.FIXED.js`

Key changes:
- Added Helmet.js for security headers
- Added rate limiting for `/api/auth/login`
- Better error handling
- Health check endpoint

### Step 4: Update Auth Controller
Replace your `src/controllers/auth.controller.js` with `FIXES/auth.controller.FIXED.js`

Key changes:
- Removed JWT from response body
- Fixed cookie configuration (sameSite: "strict")
- Better error handling
- Input validation

### Step 5: Update Auth Middleware
Replace your `src/middleware/auth.middleware.js` with `FIXES/auth.middleware.FIXED.js`

Key changes:
- Better error handling
- Token expiration handling
- Security logging

### Step 6: Add Validation Middleware
Copy `FIXES/validation.middleware.js` to `src/middleware/validation.middleware.js`

### Step 7: Update Create Inquiry Controller
Replace `src/controllers/createInquiry.controller.js` with `FIXES/createInquiry.controller.FIXED.js`

### Step 8: Update Routes
Update your route files to use validation middleware:

**src/routes/auth.route.js:**
```javascript
import express from "express";
import { validateAdminLogin } from "../middleware/validation.middleware.js";
import { protectAdminRoute } from "../middleware/auth.middleware.js";
import { adminLoginController, adminLogoutController } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", validateAdminLogin, adminLoginController);
router.post("/logout", protectAdminRoute, adminLogoutController);

export default router;
```

**src/routes/user.route.js:**
```javascript
import express from "express";
import { validateCreateInquiry } from "../middleware/validation.middleware.js";
import { createInquiry } from "../controllers/createInquiry.controller.js";

const router = express.Router();

router.post("/contact-inquiry", validateCreateInquiry, createInquiry);

export default router;
```

**src/routes/admin.route.js:**
```javascript
import express from "express";
import { protectAdminRoute } from "../middleware/auth.middleware.js";
import { validateObjectId } from "../middleware/validation.middleware.js";
import { getAllInquiries } from "../controllers/getInquiredDetails.controller.js";
import { deleteInquiryDetails } from "../controllers/deleteInquiryDetails.controller.js";

const router = express.Router();

router.get("/get-all-inquiries", protectAdminRoute, getAllInquiries);
router.delete("/delete-details/:id", protectAdminRoute, validateObjectId, deleteInquiryDetails);

export default router;
```

### Step 9: Update Models
Replace `src/models/adminModel.js` with `FIXES/adminModel.FIXED.js`

Key improvements:
- Better password validation
- Login tracking
- Brute force protection

### Step 10: Update .env
Copy `FIXES/.env.example` to `.env` and fill in your actual values:
```bash
cp FIXES/.env.example .env
# Then edit .env with your actual configuration
```

### Step 11: Test Everything
```bash
npm install
npm run dev

# Test endpoints
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@portfolio.com","password":"YourPassword123!"}'
```

---

## Detailed Implementation by Priority

### Priority 1: CRITICAL (Do First)

#### Fix 1: Remove JWT from Response
**File:** `src/controllers/auth.controller.js`

Before:
```javascript
return res.status(200).json({
    success: true,
    user: { ... },
    token  // ❌ Remove this
});
```

After:
```javascript
return res.status(200).json({
    success: true,
    user: { ... }
    // Token is only in secure cookie
});
```

#### Fix 2: Add Rate Limiting
**File:** `src/app.js`

```javascript
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per IP
    message: 'Too many login attempts. Please try again later.',
});

app.use("/api/auth/login", authLimiter);
```

#### Fix 3: Fix Email Validation
**File:** `src/models/adminModel.js` and `src/models/userModel.js`

Before:
```javascript
match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, '...']
```

After:
```javascript
match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
```

#### Fix 4: Add Helmet.js
**File:** `src/app.js`

```javascript
import helmet from 'helmet';

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
        },
    },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
}));
```

### Priority 2: HIGH (Do Next)

#### Fix 5: Add Input Validation
**File:** Create `src/middleware/validation.middleware.js`

Use the complete validation middleware from `FIXES/validation.middleware.js`

#### Fix 6: Fix Cookie Configuration
**File:** `src/controllers/auth.controller.js`

```javascript
res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",  // Changed from "lax"
    path: "/",
    maxAge: 3 * 24 * 60 * 60 * 1000,
});
```

#### Fix 7: Split Model Files
**File:** `src/models/`

The `adminModel.js` has userModel code appended. Split into separate files:

Create `src/models/userModel.js`:
```javascript
import mongoose from 'mongoose';

const contactInquirySchema = new mongoose.Schema({
    // ... schema definition
});

const ContactInquiry = mongoose.models.ContactInquiry || 
    mongoose.model('ContactInquiry', contactInquirySchema);

export default ContactInquiry;
```

### Priority 3: MEDIUM (Do Before Production)

#### Fix 8: Add Request Logging
**File:** `src/app.js`

```javascript
import morgan from 'morgan';

// For production, log to file
const accessLogStream = fs.createWriteStream('logs/access.log', { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));
```

#### Fix 9: Improve Error Handling
All controllers should follow this pattern:

```javascript
catch (error) {
    console.error("Error:", error);
    
    return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later.",
        // Only in development:
        ...(process.env.NODE_ENV === 'development' && { 
            error: error.message 
        })
    });
}
```

#### Fix 10: Add Pagination
**File:** `src/controllers/getInquiredDetails.controller.js`

```javascript
export const getAllInquiries = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        const inquiries = await ContactInquiry.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        const total = await ContactInquiry.countDocuments();

        return res.status(200).json({
            success: true,
            data: inquiries,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        // ...
    }
};
```

---

## Configuration Checklist

### Environment Variables
```bash
# Create .env file with these variables:
NODE_ENV=production
SERVER_PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=<use-openssl-rand-base64-32>
ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=<strong-password>
CLIENT_URL=https://yourdomain.com
COOKIE_DOMAIN=yourdomain.com
HTTPS_ENABLED=true
```

### Generate Strong JWT_SECRET
```bash
openssl rand -base64 32
# Copy the output to your .env JWT_SECRET
```

---

## Testing After Implementation

### 1. Test Authentication Flow
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@portfolio.com","password":"YourPassword123!"}'

# Should get cookie but NO token in response
# Verify: Response should NOT have a token field
```

### 2. Test Rate Limiting
```bash
# Run 6 login attempts quickly
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done

# After 5 attempts, should get rate limit error
```

### 3. Test Input Validation
```bash
# Test with invalid email
curl -X POST http://localhost:5000/api/user/contact-inquiry \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"invalid-email","message":"test"}'

# Should get validation error
```

### 4. Test Security Headers
```bash
curl -I http://localhost:5000/health

# Should see security headers:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
# Strict-Transport-Security: max-age=31536000
```

### 5. Run Security Audit
```bash
npm audit

# Should have fewer vulnerabilities
# Fix any critical vulnerabilities found
```

---

## Troubleshooting

### "module not found" errors
```bash
npm install
npm list  # Check all dependencies are installed
```

### Validation errors on valid input
```bash
# Check validation rules in validation.middleware.js
# Might need to adjust regex patterns or length limits
```

### CORS errors
```bash
# Verify CLIENT_URL in .env matches your frontend domain
# Check CORS config in app.js allows your origin
```

### Rate limiting too strict
```javascript
// In app.js, adjust these values:
max: 5,              // Increase this for more attempts
windowMs: 15 * 60 * 1000,  // Or increase this duration
```

---

## Next Steps

1. ✅ Apply all fixes from this guide
2. ✅ Test thoroughly locally
3. ✅ Deploy to staging environment
4. ✅ Run security audit on deployed version
5. ✅ Monitor for errors in production
6. ✅ Set up alerts and monitoring
7. ✅ Plan regular security audits (quarterly)

---

**Document Version:** 1.0  
**Last Updated:** June 30, 2026


------------------------------------
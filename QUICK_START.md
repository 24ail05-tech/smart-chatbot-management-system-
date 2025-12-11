# Quick Start Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ Node.js v16+ installed
- ✅ MongoDB running (locally or MongoDB Atlas account)
- ✅ npm or yarn package manager

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure MongoDB

### Option A: MongoDB Atlas (Cloud - Recommended)

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `.env`:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/student-chatbot?retryWrites=true&w=majority
   ```

### Option B: Local MongoDB

1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```
3. Verify `.env` has:
   ```
   MONGO_URI=mongodb://localhost:27017/student-chatbot
   ```

## 3. (Optional) Get Gemini API Key

1. Visit https://makersuite.google.com/app/apikey
2. Generate an API key
3. Update in `.env`:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

## 4. Start the Server

### Development Mode (with auto-reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

## 5. Access the Application

Open your browser and navigate to:
```
http://localhost:5000
```

## 6. Create Your First Account

1. Click "New user? Signup"
2. Fill in your details:
   - Name: Your Full Name
   - Roll Number: e.g., 21CS001
   - Department: e.g., Computer Science
   - Class: e.g., III Year
   - Email: your@email.com
   - Password: (8+ chars, include uppercase & number)
3. Click "Sign Up"
4. Login with your credentials

## 7. Create an Admin Account

### Method 1: Using MongoDB Directly

```bash
# Connect to MongoDB
mongosh

# Switch to database
use student-chatbot

# Update a user to admin
db.students.updateOne(
  { roll: "21CS001" },
  { $set: { role: "admin" } }
)
```

### Method 2: Using MongoDB Compass (GUI)

1. Download MongoDB Compass
2. Connect to your database
3. Find the `students` collection
4. Edit a student document and change `role: "student"` to `role: "admin"`

## Common Issues & Solutions

### Issue: "MongoDB connection error"
**Solution**: 
- Verify MongoDB is running
- Check MONGO_URI in .env
- For Atlas: Whitelist your IP address in Atlas Security settings

### Issue: "Port already in use"
**Solution**:
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9

# Or change PORT in .env file
PORT=3000
```

### Issue: "Redis connection error"
**Solution**: Redis is optional. Comment out REDIS_URL in .env:
```
# REDIS_URL=redis://localhost:6379
```

### Issue: "Invalid CSRF token"
**Solution**: Clear browser cache and cookies, then login again

### Issue: "Can't access from another device"
**Solution**: 
1. Find your local IP: `ifconfig` (Mac/Linux) or `ipconfig` (Windows)
2. Update API_URL in HTML files to use your IP
3. Restart server with: `PORT=5000 HOST=0.0.0.0 npm start`

## Project Structure

```
smart-chatbot-management-system-/
├── server.js              # Main server (API + Socket.IO)
├── package.json           # Dependencies
├── .env                   # Environment variables (YOU MUST CONFIGURE)
├── .env.example          # Example environment file
├── .gitignore            # Git ignore rules
├── README.md             # Full documentation
├── QUICK_START.md        # This file
├── setup.sh              # Setup script
├── start-dev.sh          # Quick start script
│
├── index.html            # Login/Signup page
├── student.html          # Student dashboard
├── admin.html            # Admin panel
├── chatbot.html          # Chat interface
├── settings.html         # Settings page
└── student-form.html     # Student form
```

## API Endpoints Overview

### Public
- GET  `/` - Home page
- GET  `/api/health` - Health check
- GET  `/api/csrf-token` - Get CSRF token
- POST `/api/auth/register` - Register
- POST `/api/auth/login` - Login

### Authenticated
- POST `/api/chat` - Send chat message
- GET  `/api/student/:roll` - Get student profile
- GET  `/api/dashboard/status` - Get dashboard data

### Admin Only
- GET  `/api/admin/students` - List all students
- POST `/api/admin/lock` - Lock account
- POST `/api/admin/unlock` - Unlock account
- POST `/api/admin/notice` - Create notice

## Features Overview

✅ **Authentication System**
- Secure JWT-based authentication
- Refresh token rotation
- CSRF protection

✅ **Student Dashboard**
- Profile management
- Chat history
- Warnings and locks
- System notices

✅ **AI Chat**
- Google Gemini AI integration
- Chat history storage
- Real-time updates

✅ **Admin Panel**
- Manage students
- Issue warnings
- Lock/unlock accounts
- Post notices
- View analytics

✅ **Security**
- Password hashing (bcrypt)
- JWT tokens
- CSRF protection
- Rate limiting (with Redis)
- Input validation

## Next Steps

1. **Customize the UI**: Edit the HTML files to match your branding
2. **Add Features**: Extend server.js with new endpoints
3. **Deploy**: Deploy to Heroku, AWS, or your preferred platform
4. **Secure**: Change all secrets in .env for production
5. **Monitor**: Set up logging and monitoring

## Getting Help

- Check README.md for detailed documentation
- Review the code comments in server.js
- Open an issue on GitHub

## Production Checklist

Before deploying to production:

- [ ] Change all secrets in .env
- [ ] Use MongoDB Atlas instead of local MongoDB
- [ ] Set up Redis for rate limiting
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set NODE_ENV=production
- [ ] Add error monitoring (Sentry, etc.)
- [ ] Set up backup strategy for MongoDB
- [ ] Review security headers
- [ ] Test all functionality

---

**Happy Coding! 🚀**

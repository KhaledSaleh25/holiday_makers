# Frontend-Backend Connection Guide

## Quick Setup Steps

### 1. Start Backend Server
```bash
# Open Terminal 1
cd "E:\College & Works\holiday makers"
npm start
```
**Expected output:**
```
Server running on port 5000
Environment: development
MongoDB Connected: [your-mongodb-url]
✅ auth routes loaded successfully
```

### 2. Start Frontend Server
```bash
# Open Terminal 2
cd "E:\College & Works\holiday makers\sprint1-main\sprint1-main"
npm start
```
**Expected output:**
```
Compiled successfully!
Local:            http://localhost:3000
On Your Network:  http://192.168.x.x:3000
```

### 3. Test the Connection

1. **Open browser:** http://localhost:3000
2. **Click "Test Backend Connection" button** (green button in login form)
3. **Check browser console** (F12 → Console tab) for test results

**Expected console output:**
```
✅ Backend is running: {message: "Egypt Holiday Makers API is running!", version: "1.0.0"}
✅ Auth routes are working: {ok: true, route: "/api/auth/_ping"}
✅ Signup endpoint working: {success: true, message: "User registered successfully", ...}
```

### 4. Test Signup/Login

1. **Try creating an account:**
   - Click "Sign Up" on the right side
   - Fill in: Name, Email, Password (min 6 chars)
   - Click "Sign Up" button

2. **Try logging in:**
   - Click "Login" on the left side  
   - Use the email/password you just created
   - Click "Login" button

## Troubleshooting

### If "Test Backend Connection" fails:

**Error: "Backend server is not running on port 5000"**
- Make sure backend is running in Terminal 1
- Check if port 5000 is free: `netstat -ano | findstr :5000`

**Error: "Network Error" or CORS issues**
- Make sure both servers are running
- Try refreshing the browser page
- Check browser console for detailed errors

### If signup/login fails:

**Check browser console for:**
- Network errors (red text)
- API response errors
- Validation errors

**Check backend terminal for:**
- Request logs: `POST /api/auth/signup`
- Error messages
- Database connection issues

## Environment Variables Required

Make sure your backend has `.env` file with:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
```

## Ports Used
- **Backend:** http://127.0.0.1:5000
- **Frontend:** http://localhost:3000
- **API Base:** http://127.0.0.1:5000/api

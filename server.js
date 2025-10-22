require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./backend/config/database');

// Connect to database
connectDB();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./backend/routes/auth'));
app.use('/api/dashboard', require('./backend/routes/dashboard'));
app.use('/api/customers', require('./backend/routes/customers'));
app.use('/api/reservations', require('./backend/routes/reservations'));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Egypt Holiday Makers Portal API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    service: 'Egypt Holiday Makers Portal',
    database: 'Connected',
    timestamp: new Date().toISOString()
  });
});

// ✅ FIX: Universal 404 route (no '*' used)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Egypt Holiday Makers Portal Backend running on port ${PORT}`);
  console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📍 API Test: http://localhost:${PORT}/api/test`);
  console.log(`📍 Login API: http://localhost:${PORT}/api/auth/login`);
});

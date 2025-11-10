require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload'); 
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
app.use(fileUpload());
// Routes
app.use('/api/auth', require('./backend/routes/auth'));
app.use('/api/dashboard', require('./backend/routes/dashboard'));
app.use('/api/customers', require('./backend/routes/customers'));
app.use('/api/reservations', require('./backend/routes/reservations'));
app.use('/api/reports', require('./backend/routes/reports'));
app.use('/api/invoices', require('./backend/routes/invoices'));
// In your server.js routes section
app.use('/api/suppliers', require('./backend/routes/suppliers'));


// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🌍 Egypt Holiday Makers Portal API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      dashboard: '/api/dashboard',
      customers: '/api/customers',
      reservations: '/api/reservations',
      reports: '/api/reports',
      invoices: '/api/invoices'
    }
  });
});

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

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Egypt Holiday Makers Portal Backend running on port ${PORT}`);
  console.log(`📍 Home: http://localhost:${PORT}/`);
  console.log(`📍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📍 API Test: http://localhost:${PORT}/api/test`);
  console.log(`📍 Login API: http://localhost:${PORT}/api/auth/login`);
});
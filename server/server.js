const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config({ path: '../.env' });

const connectDB = require('./config/database');

// Initialize Express
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
    origin: process.env.SITE_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging

// Routes
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/detailers', require('./routes/detailers'));

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Book Auto Clean API is running',
        timestamp: new Date().toISOString(),
        database: 'Connected'
    });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Book Auto Clean API',
        version: '1.0.0',
        endpoints: {
            bookings: '/api/bookings',
            detailers: '/api/detailers',
            health: '/api/health'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 CORS enabled for: ${process.env.SITE_URL || 'http://localhost:3000'}`);
    console.log(`\n✨ Book Auto Clean API v1.0.0`);
    console.log(`   - Bookings API: http://localhost:${PORT}/api/bookings`);
    console.log(`   - Detailers API: http://localhost:${PORT}/api/detailers`);
    console.log(`   - Health Check: http://localhost:${PORT}/api/health\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});

module.exports = app;

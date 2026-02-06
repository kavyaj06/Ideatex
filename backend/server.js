const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Clear Mongoose model cache to fix schema validation issues
if (mongoose.modelNames && mongoose.modelNames().includes('Announcement')) {
    delete mongoose.models['Announcement'];
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// API Routes
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Routes
const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');
const aiRoutes = require('./routes/ai');

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/ai', aiRoutes);

// Test route
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is working!' });
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Root route serves login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/studentlogin.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Frontend: http://localhost:${PORT}`);
    console.log(`📊 API: http://localhost:${PORT}/api`);
});
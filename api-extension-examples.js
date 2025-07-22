/**
 * API Extension Examples
 * 
 * This file contains practical examples of how to extend the basic API
 * with common patterns and features. These examples demonstrate the
 * concepts outlined in the README.md API Extension Guide.
 * 
 * To use these examples:
 * 1. Copy the relevant code to your api.js file
 * 2. Install any additional dependencies if needed
 * 3. Modify configurations as needed for your use case
 * 
 * Note: This file is for reference only and is not meant to be run directly.
 */

import express from 'express';

// Example: Enhanced JWT Authentication
// First install: npm install jsonwebtoken
/*
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login endpoint to generate JWT tokens
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    // In a real app, validate credentials against database
    if (username === 'admin' && password === 'password') {
        const token = jwt.sign(
            { userId: 1, username: 'admin', role: 'admin' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({ 
            success: true, 
            token,
            user: { username: 'admin', role: 'admin' }
        });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// Enhanced JWT validation middleware
const validateJWTToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No valid token provided' });
    }
    
    const token = authHeader.substring(7);
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};
*/

// Example: Input Validation with Joi
// First install: npm install joi
/*
import Joi from 'joi';

const validateInput = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                error: 'Validation failed',
                details: error.details.map(d => d.message)
            });
        }
        next();
    };
};

const userSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    age: Joi.number().min(18).max(120).optional()
});

// Protected endpoint with validation
app.post('/api/users', validateJWTToken, validateInput(userSchema), (req, res) => {
    const { name, email, age } = req.body;
    
    // Save user to database
    const user = { id: Date.now(), name, email, age };
    
    res.status(201).json({ 
        success: true, 
        user,
        message: 'User created successfully'
    });
});
*/

// Example: Simple Rate Limiting
const rateLimitMap = new Map();

const rateLimit = (maxRequests = 100, windowMs = 60000) => {
    return (req, res, next) => {
        const clientIp = req.ip || req.connection.remoteAddress;
        const now = Date.now();
        const windowStart = now - windowMs;
        
        if (!rateLimitMap.has(clientIp)) {
            rateLimitMap.set(clientIp, []);
        }
        
        const requests = rateLimitMap.get(clientIp).filter(time => time > windowStart);
        
        if (requests.length >= maxRequests) {
            return res.status(429).json({ 
                error: 'Too many requests',
                retryAfter: Math.ceil(windowMs / 1000)
            });
        }
        
        requests.push(now);
        rateLimitMap.set(clientIp, requests);
        
        // Clean up old entries periodically
        if (Math.random() < 0.1) {
            for (const [ip, times] of rateLimitMap.entries()) {
                const validTimes = times.filter(time => time > windowStart);
                if (validTimes.length === 0) {
                    rateLimitMap.delete(ip);
                } else {
                    rateLimitMap.set(ip, validTimes);
                }
            }
        }
        
        next();
    };
};

// Example: Request Logging Middleware
const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;
    
    console.log(`${timestamp} - ${req.method} ${req.path} - IP: ${ip}`);
    
    // Log response status when response finishes
    res.on('finish', () => {
        console.log(`${timestamp} - ${req.method} ${req.path} - ${res.statusCode} - IP: ${ip}`);
    });
    
    next();
};

// Example: CORS Middleware
const corsMiddleware = (req, res, next) => {
    const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || ['*'];
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin || '*');
    }
    
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
};

// Example: File-based Data Storage
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = './data';

// Ensure data directory exists
const initializeDataStorage = async () => {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        console.log('Data storage initialized');
    } catch (error) {
        console.error('Failed to initialize data storage:', error);
    }
};

// Simple data storage functions
const saveData = async (key, value) => {
    try {
        const filePath = path.join(DATA_DIR, `${key}.json`);
        await fs.writeFile(filePath, JSON.stringify(value, null, 2));
        return true;
    } catch (error) {
        console.error('Save error:', error);
        return false;
    }
};

const loadData = async (key) => {
    try {
        const filePath = path.join(DATA_DIR, `${key}.json`);
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return null;
    }
};

// Example: Health Check Endpoint
const healthCheck = (req, res) => {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(uptime / 60)}m ${Math.floor(uptime % 60)}s`,
        memory: {
            used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
            total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
        },
        environment: process.env.NODE_ENV || 'development'
    });
};

// Example usage in Express app:
/*
const app = express();

// Apply middleware
app.use(corsMiddleware);
app.use(requestLogger);
app.use('/api', rateLimit(50, 60000)); // 50 requests per minute for API routes
app.use(express.json());

// Health check
app.get('/health', healthCheck);

// API routes
app.get('/api/data/:key', validateJWTToken, async (req, res) => {
    const { key } = req.params;
    const data = await loadData(key);
    
    if (data === null) {
        return res.status(404).json({ error: 'Data not found' });
    }
    
    res.json({ key, data });
});

app.post('/api/data/:key', validateJWTToken, async (req, res) => {
    const { key } = req.params;
    const { value } = req.body;
    
    const success = await saveData(key, value);
    
    if (success) {
        res.json({ success: true, message: 'Data saved' });
    } else {
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Initialize and start server
const startServer = async () => {
    await initializeDataStorage();
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Enhanced API server running on port ${PORT}`);
    });
};

startServer();
*/

export {
    rateLimit,
    requestLogger,
    corsMiddleware,
    saveData,
    loadData,
    healthCheck,
    initializeDataStorage
};
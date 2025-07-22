// Simple Node.js API with public and protected endpoints
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Public endpoint - /hello
app.get('/hello', (req, res) => {
    res.json({ message: 'Hello World' });
});

// Simple token validation middleware
const validateToken = (req, res, next) => {
    const token = req.headers.authorization;
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    // Simple token validation - in a real app, this would be more sophisticated
    if (token !== 'Bearer valid-token') {
        return res.status(403).json({ error: 'Invalid token' });
    }
    
    next();
};

// Protected endpoint - /secure-hello (requires token)
app.get('/secure-hello', validateToken, (req, res) => {
    res.json({ message: 'Hello World (Secure)' });
});

// Start server only if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    app.listen(PORT, () => {
        console.log(`API server running on http://localhost:${PORT}`);
        console.log('Public endpoint: GET /hello');
        console.log('Protected endpoint: GET /secure-hello (requires Authorization: Bearer valid-token)');
    });
}

export default app;
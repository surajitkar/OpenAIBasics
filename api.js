/**
 * Simple Node.js API with public and protected endpoints
 * 
 * This file provides a foundation for building REST APIs with Express.js.
 * It includes examples of both public and protected endpoints with authentication.
 * 
 * Extensibility Features:
 * - Modular middleware system for authentication and validation
 * - Structured JSON responses with consistent error handling
 * - Environment-based configuration for deployment flexibility
 * - ES modules support for modern JavaScript development
 * 
 * Usage:
 *   node api.js                    # Start the server
 *   curl localhost:3000/hello      # Test public endpoint
 *   curl -H "Authorization: Bearer valid-token" localhost:3000/secure-hello
 * 
 * Extension Examples:
 *   See README.md section "API Server Extension Guide" for detailed examples of:
 *   - Adding new endpoints (GET, POST, PUT, DELETE)
 *   - Enhanced authentication (JWT, role-based access)
 *   - Database integration patterns
 *   - Input validation and error handling
 *   - Rate limiting and security middleware
 */

import express from 'express';

const app = express();

// Configuration - easily extensible via environment variables
const config = {
    port: process.env.PORT || 3000,
    // Add more configuration options here:
    // jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    // databaseUrl: process.env.DATABASE_URL || 'sqlite://./dev.db',
    // corsOrigin: process.env.CORS_ORIGIN || '*'
};

// Core Middleware Setup
// These middleware functions run on every request and provide foundational functionality

// Parse JSON request bodies (required for POST/PUT requests with JSON data)
app.use(express.json());

// Parse URL-encoded request bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// Add request logging (uncomment to enable)
// app.use((req, res, next) => {
//     console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
//     next();
// });

// PUBLIC ENDPOINTS
// These endpoints are accessible without authentication

/**
 * GET /hello - Basic public endpoint
 * 
 * Returns a simple greeting message. Perfect for health checks
 * and testing basic API connectivity.
 * 
 * Response: { message: "Hello World" }
 */
app.get('/hello', (req, res) => {
    res.json({ message: 'Hello World' });
});

// AUTHENTICATION MIDDLEWARE
// This section contains reusable middleware for protecting endpoints

/**
 * Simple Bearer token validation middleware
 * 
 * This is a basic implementation for demonstration purposes.
 * In production, consider using:
 * - JWT tokens with proper validation
 * - OAuth 2.0 / OpenID Connect
 * - API key authentication
 * - Session-based authentication
 * 
 * Extension Ideas:
 * - Add user role/permission checking
 * - Implement token expiration
 * - Add rate limiting per user
 * - Log authentication attempts
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object  
 * @param {Function} next - Express next middleware function
 */
const validateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    // Check if Authorization header is present
    if (!authHeader) {
        return res.status(401).json({ 
            error: 'No token provided',
            message: 'Include Authorization header with Bearer token'
        });
    }
    
    // Validate token format and value
    // In a real application, you might:
    // 1. Verify JWT signature and expiration
    // 2. Check token against database/cache
    // 3. Decode user information from token
    // 4. Add user context to req.user
    if (authHeader !== 'Bearer valid-token') {
        return res.status(403).json({ 
            error: 'Invalid token',
            message: 'Provided token is not valid or has expired'
        });
    }
    
    // Token is valid, proceed to the protected route
    // In a JWT implementation, you might add: req.user = decodedToken;
    next();
};

// PROTECTED ENDPOINTS  
// These endpoints require valid authentication

/**
 * GET /secure-hello - Protected endpoint example
 * 
 * Demonstrates how to protect an endpoint with authentication middleware.
 * The validateToken middleware runs first, then this handler executes.
 * 
 * Required Header: Authorization: Bearer valid-token
 * Response: { message: "Hello World (Secure)" }
 */
app.get('/secure-hello', validateToken, (req, res) => {
    res.json({ 
        message: 'Hello World (Secure)',
        // In a real app, you might include user-specific data:
        // user: req.user,
        // timestamp: new Date().toISOString()
    });
});

// ERROR HANDLING
// Global error handler for unhandled errors (add after all routes)

/**
 * 404 handler for undefined routes
 * This should be one of the last middleware functions
 */
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Endpoint not found',
        message: `Route ${req.method} ${req.originalUrl} does not exist`,
        availableEndpoints: [
            'GET /hello',
            'GET /secure-hello (requires Authorization header)'
        ]
    });
});

/**
 * Global error handler
 * Catches any unhandled errors in the application
 */
app.use((error, req, res, next) => {
    console.error('API Error:', error);
    
    res.status(error.status || 500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// SERVER STARTUP
// Only start the server if this file is executed directly (not imported as a module)

/**
 * Start the Express server
 * 
 * The server will only start when this file is run directly with `node api.js`.
 * When imported as a module (e.g., for testing), the server won't start automatically.
 * 
 * Environment Variables:
 * - PORT: Server port (default: 3000)
 * - NODE_ENV: Environment mode (development, production, test)
 */
if (import.meta.url === `file://${process.argv[1]}`) {
    app.listen(config.port, () => {
        console.log(`🚀 API server running on http://localhost:${config.port}`);
        console.log('📚 Available endpoints:');
        console.log('   📖 Public:    GET /hello');
        console.log('   🔒 Protected: GET /secure-hello (requires Authorization: Bearer valid-token)');
        console.log('');
        console.log('💡 See README.md "API Server Extension Guide" for examples on extending this API');
        console.log('🧪 Run tests with: npm test');
    });
}

// Export the Express app for testing and module imports
export default app;
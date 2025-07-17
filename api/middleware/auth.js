// Authentication middleware
export const validateApiKey = (req, res, next) => {
  // Check for OpenAI API key in environment or headers
  const openaiApiKey = process.env.OPENAI_API_KEY || req.headers['x-openai-api-key'];
  
  if (!openaiApiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'OpenAI API key is required. Set OPENAI_API_KEY environment variable or provide X-OpenAI-API-Key header.',
      code: 'MISSING_API_KEY'
    });
  }

  // Add API key to request for use in routes
  req.openaiApiKey = openaiApiKey;
  next();
};

// Optional API key validation for public endpoints
export const optionalApiKey = (req, res, next) => {
  const openaiApiKey = process.env.OPENAI_API_KEY || req.headers['x-openai-api-key'];
  req.openaiApiKey = openaiApiKey;
  next();
};

// Validate custom API key header for internal API access
export const validateInternalApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.INTERNAL_API_KEY || 'dev-key-12345';
  
  if (!apiKey || apiKey !== validApiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing API key',
      code: 'INVALID_API_KEY'
    });
  }
  
  next();
};
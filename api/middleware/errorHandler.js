// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // OpenAI API errors
  if (err.message.includes('quota') || err.message.includes('billing')) {
    return res.status(402).json({
      error: 'Payment Required',
      message: 'OpenAI API quota exceeded or billing issue. Please check your account.',
      code: 'QUOTA_EXCEEDED'
    });
  }

  if (err.message.includes('API key')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing OpenAI API key',
      code: 'INVALID_API_KEY'
    });
  }

  // Rate limiting errors
  if (err.message.includes('rate limit')) {
    return res.status(429).json({
      error: 'Rate Limit Exceeded',
      message: 'Too many requests. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED'
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      code: 'VALIDATION_ERROR'
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    error: err.status ? 'Client Error' : 'Internal Server Error',
    message: err.message || 'Something went wrong',
    code: err.code || 'UNKNOWN_ERROR'
  });
};
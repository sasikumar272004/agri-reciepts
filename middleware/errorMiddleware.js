// Centralized Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  console.error('🔥 Error:', err.stack || err.message);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? '🥞 Stack hidden' : err.stack,
  });
};

export default errorHandler;

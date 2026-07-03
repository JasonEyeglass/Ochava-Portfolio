export function errorHandler(err, req, res, _next) {
  console.error('[error]', err.message);

  const status = err.status || 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred.'
      : err.message;

  res.status(status).json({
    success: false,
    message,
  });
}

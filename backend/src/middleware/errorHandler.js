// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const status =
    err.statusCode ||
    (err.name === 'ValidationError'
      ? 400
      : err.code === 11000
        ? 409
        : 500);

  const message =
    err.code === 11000
      ? 'An account with this email already exists'
      : status === 500 && process.env.NODE_ENV === 'production'
        ? 'Something went wrong'
        : err.message;

  if (status === 500) console.error(err);

  res.status(status).json({ message });
};
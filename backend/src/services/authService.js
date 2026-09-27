const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

function tokenFor(user) {
  return jwt.sign({ sub: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '7d' });
}
function safeUser(user) {
  return { id: user._id, name: user.name, email: user.email };
}
async function register({ name, email, password }) {
  if (!name || !email || !password) throw new AppError('Name, email, and password are required');
  if (password.length < 8) throw new AppError('Password must be at least 8 characters');
  const normalizedEmail = email.trim().toLowerCase();
  if (await User.exists({ email: normalizedEmail })) throw new AppError('An account with this email already exists', 409);
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash });
  return { user: safeUser(user), token: tokenFor(user) };
}
async function login({ email, password }) {
  if (!email || !password) throw new AppError('Email and password are required');
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+passwordHash');
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) throw new AppError('Email or password is incorrect', 401);
  return { user: safeUser(user), token: tokenFor(user) };
}
module.exports = { register, login, safeUser };

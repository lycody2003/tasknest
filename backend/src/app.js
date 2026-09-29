const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const auth = require('./middleware/auth');
const AppError = require('./utils/AppError');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }));
app.use(express.json({ limit: '1mb' }));
app.use(mongoSanitize());

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'tasknest-api' }));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', auth, require('./routes/projectRoutes'));
app.use('/api/tasks', auth, require('./routes/taskRoutes'));
app.use((req, res, next) => next(new AppError('Route not found', 404)));
app.use(errorHandler);
module.exports = app;

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const port = process.env.PORT || 4000;

async function start() {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required');
  await connectDB();
  app.listen(port, '0.0.0.0', () => console.log(`TaskNest API listening on ${port}`));
}
start().catch(err => { console.error('Server startup failed:', err.message); process.exit(1); });

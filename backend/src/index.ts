import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import newsRouter from './routes/news';
import membersRouter from './routes/members';
import groupsRouter from './routes/groups';
import eventsRouter from './routes/events';
import searchRouter from './routes/search';

// Import middleware
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'HelloProjects Backend API' });
});

// API Routes
app.use('/api/news', newsRouter);
app.use('/api/members', membersRouter);
app.use('/api/groups', groupsRouter);
app.use('/api/events', eventsRouter);
app.use('/api/search', searchRouter);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Endpoint not found',
      statusCode: 404,
    },
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/api/health`);
  console.log('Available endpoints:');
  console.log('  - GET /api/news');
  console.log('  - GET /api/news/:id');
  console.log('  - GET /api/members');
  console.log('  - GET /api/members/:id');
  console.log('  - GET /api/groups');
  console.log('  - GET /api/groups/:id');
  console.log('  - GET /api/events');
  console.log('  - GET /api/events/:id');
  console.log('  - GET /api/search?q=xxx');
});

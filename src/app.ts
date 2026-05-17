import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import 'express-async-errors';
import { createServer } from 'http';

// Import configs
import { env } from './config/env';

// Import middlewares
import { errorMiddleware } from './middlewares/error.middleware';
import { notFoundMiddleware } from './middlewares/notFound.middleware';
import { rateLimitMiddleware } from './middlewares/rateLimit.middleware';
import { loggerMiddleware } from './middlewares/logger.middleware';

// Import routes
import routes from './routes';

// Import socket
import { initializeSocket } from './sockets/socket';

const app = express();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false,
}));
app.use(compression());
app.use(cors({
  origin: (origin, callback) => {
    const allowed = (env.ALLOWED_ORIGINS || 'http://localhost:3000')
      .split(',')
      .map((o) => o.trim());
    // Allow requests with no origin (e.g. mobile apps, curl, same-origin SSR)
    if (!origin || allowed.includes('*') || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(loggerMiddleware);
app.use(rateLimitMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: env.NODE_ENV,
    aiProvider: 'Google Gemini (Free)',
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'MentorHub API is running',
    version: '1.0.0',
    endpoints: {
      api: '/api',
      health: '/health'
    }
  });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use(notFoundMiddleware);

// Global error handler
app.use(errorMiddleware);

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
initializeSocket(httpServer);

// Export both app and server
export { app };
export const server = httpServer;j
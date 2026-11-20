import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/env';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';

export function createApp(): Application {
  const app = express();

  // Defense-in-depth: Disable the X-Powered-By header
  app.disable('x-powered-by');

  // Configure Helmet with strict security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'blob:'],
          connectSrc: ["'self'", env.CLIENT_URL],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'none'"],
          frameSrc: ["'none'"],
        },
      },
      frameguard: { action: 'deny' },
      noSniff: true,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    })
  );

  // Configure CORS with explicit allowlist (never wildcard * in production)
  const allowedOrigins = [
    env.CLIENT_URL.trim(),
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, or automated test runners)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} not permitted by CORS policy`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Apply general API rate limiting
  app.use('/api', apiLimiter);

  // Enforce small payload size limits to protect against DoS attacks
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));

  // Mount API routes
  app.use('/api', routes);

  // 404 handler for undefined API routes
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: 'The requested API route was not found.',
    });
  });

  // Global centralized error handler
  app.use(errorHandler);

  return app;
}

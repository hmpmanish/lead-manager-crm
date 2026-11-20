import { Router } from 'express';
import authRoutes from './auth.routes';
import leadRoutes from './lead.routes';

const router = Router();

// Health check endpoint for uptime and monitoring
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);

export default router;

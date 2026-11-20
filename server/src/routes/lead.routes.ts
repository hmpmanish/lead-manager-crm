import { Router } from 'express';
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  deleteLead,
} from '../controllers/lead.controller';
import { authenticateToken } from '../middleware/auth';
import { validateBody, validateQuery } from '../middleware/validate';
import {
  createLeadSchema,
  updateLeadSchema,
  leadQuerySchema,
} from '../schemas/lead.schema';

const router = Router();

// Every single lead route requires authentication
router.use(authenticateToken);

router.get('/', validateQuery(leadQuerySchema), getLeads);
router.post('/', validateBody(createLeadSchema), createLead);
router.get('/:id', getLeadById);
router.put('/:id', validateBody(updateLeadSchema), updateLead);
router.delete('/:id', deleteLead);

export default router;

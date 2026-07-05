import { Router } from 'express';
import auth from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';
import * as slotController from '../controllers/slot.controller.js';

const router = Router();

router.get('/', auth, slotController.getAll);

router.post('/', auth, authorize('admin'), slotController.create);
router.patch('/:id', auth, authorize('admin'), slotController.update);
router.delete('/:id', auth, authorize('admin'), slotController.remove);

export default router;

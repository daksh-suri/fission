import { Router } from 'express';
import auth from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';
import * as tableController from '../controllers/table.controller.js';

const router = Router();

router.use(auth, authorize('admin'));

router.post('/', tableController.createTable);
router.get('/', tableController.getAllTables);
router.patch('/:id', tableController.updateTable);
router.delete('/:id', tableController.deleteTable);

export default router;

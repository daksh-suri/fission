import { Router } from 'express';
import auth from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';
import * as reservationController from '../controllers/reservation.controller.js';

const router = Router();

router.use(auth, authorize('customer'));

router.post('/', reservationController.create);
router.get('/my', reservationController.getMy);
router.delete('/:id', reservationController.cancel);

export default router;

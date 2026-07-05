import { Router } from 'express';
import auth from '../middleware/auth.js';
import authorize from '../middleware/authorize.js';
import * as reservationController from '../controllers/reservation.controller.js';

const router = Router();

router.use(auth, authorize('admin'));

router.get('/reservations', reservationController.getAll);
router.patch('/reservations/:id', reservationController.update);
router.delete('/reservations/:id', reservationController.adminCancel);

export default router;

import { Router } from 'express';
import { paymentController } from '../controllers/paymentController.js';
import { authenticateJWT } from '../middlewares/auth.js';

const router = Router();

router.post('/process', (req, res, next) => paymentController.processPayment(req, res, next));
router.get('/history', authenticateJWT, (req, res, next) => paymentController.getHistory(req, res, next));
router.get('/transactions/:txnId', authenticateJWT, (req, res, next) => paymentController.getByTransactionId(req, res, next));

export default router;

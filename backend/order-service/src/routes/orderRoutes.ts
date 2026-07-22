import { Router } from 'express';
import { orderController } from '../controllers/orderController.js';
import { authenticateJWT, requireRole } from '../middlewares/auth.js';

const router = Router();

router.post('/checkout', authenticateJWT, (req, res, next) => orderController.checkout(req, res, next));
router.get('/my-orders', authenticateJWT, (req, res, next) => orderController.getMyOrders(req, res, next));
router.get('/all-orders', authenticateJWT, requireRole('admin'), (req, res, next) => orderController.getAllOrders(req, res, next));
router.get('/:id', authenticateJWT, (req, res, next) => orderController.getOrderById(req, res, next));
router.post('/:id/cancel', authenticateJWT, (req, res, next) => orderController.cancelOrder(req, res, next));
router.put('/:id/status', authenticateJWT, requireRole('admin'), (req, res, next) => orderController.updateOrderStatus(req, res, next));

export default router;

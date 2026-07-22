import { Router } from 'express';
import { cartController } from '../controllers/cartController.js';
import { authenticateJWT } from '../middlewares/auth.js';

const router = Router();

router.get('/', authenticateJWT, (req, res, next) => cartController.getCart(req, res, next));
router.post('/add', authenticateJWT, (req, res, next) => cartController.addToCart(req, res, next));
router.put('/increase', authenticateJWT, (req, res, next) => cartController.increaseQuantity(req, res, next));
router.put('/decrease', authenticateJWT, (req, res, next) => cartController.decreaseQuantity(req, res, next));
router.delete('/items/:productId', authenticateJWT, (req, res, next) => cartController.removeItem(req, res, next));
router.post('/clear', authenticateJWT, (req, res, next) => cartController.clearCart(req, res, next));

export default router;

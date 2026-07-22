import { Router } from 'express';
import { productController } from '../controllers/productController.js';
import { authenticateJWT, requireRole } from '../middlewares/auth.js';

const router = Router();

router.get('/products', (req, res, next) => productController.getAllProducts(req, res, next));
router.get('/categories', (req, res, next) => productController.getCategories(req, res, next));
router.get('/products/:id', (req, res, next) => productController.getProductById(req, res, next));
router.post('/products', authenticateJWT, requireRole('admin'), (req, res, next) => productController.addProduct(req, res, next));
router.put('/products/:id', authenticateJWT, requireRole('admin'), (req, res, next) => productController.updateProduct(req, res, next));
router.delete('/products/:id', authenticateJWT, requireRole('admin'), (req, res, next) => productController.deleteProduct(req, res, next));
router.put('/inventory/:id', (req, res, next) => productController.updateInventory(req, res, next));

export default router;

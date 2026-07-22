import { Router } from 'express';
import { userController } from '../controllers/userController.js';
import { authenticateJWT, requireRole } from '../middlewares/auth.js';

const router = Router();

router.post('/register', (req, res, next) => userController.register(req, res, next));
router.post('/login', (req, res, next) => userController.login(req, res, next));
router.post('/logout', authenticateJWT, (req, res, next) => userController.logout(req, res, next));
router.get('/profile', authenticateJWT, (req, res, next) => userController.getProfile(req, res, next));
router.put('/profile/update', authenticateJWT, (req, res, next) => userController.updateProfile(req, res, next));
router.delete('/profile/delete', authenticateJWT, (req, res, next) => userController.deleteProfile(req, res, next));
router.get('/users', authenticateJWT, requireRole('admin'), (req, res, next) => userController.getAllUsers(req, res, next));

export default router;

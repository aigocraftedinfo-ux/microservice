import { Router } from 'express';
import { notificationController } from '../controllers/notificationController.js';

const router = Router();

router.post('/send', (req, res, next) => notificationController.sendNotification(req, res, next));
router.get('/logs', (req, res, next) => notificationController.getLogs(req, res, next));

export default router;

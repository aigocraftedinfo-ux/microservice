import { Router } from 'express';
import { gatewayController } from '../controllers/gatewayController.js';

const router = Router();

router.get('/health', (req, res) => gatewayController.getHealth(req, res));
router.get('/dashboard', (req, res, next) => gatewayController.getDashboard(req, res, next));
router.get('/ping/:serviceName', (req, res, next) => gatewayController.pingSingleService(req, res, next));

export default router;

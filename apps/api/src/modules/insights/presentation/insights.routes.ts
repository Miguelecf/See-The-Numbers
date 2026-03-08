import { Router } from 'express';
import * as insightsController from './insights.controller';

const router = Router();

router.get('/', insightsController.getInsights);

export default router;

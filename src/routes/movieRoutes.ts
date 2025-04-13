import { Router } from 'express';
import { MovieController } from '../controllers/MovieController';

const router = Router();
const controller = new MovieController();

router.get('/producers/intervals', (req, res) => controller.getProducerIntervals(req, res));

export default router; 
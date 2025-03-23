import { Router } from 'express';
import { update } from '../controllers/userController';

const router = Router();

router.patch('/:id', update);

export default router;

import { Router } from 'express';
import {
  changeStatus,
  create,
  getAll,
  update,
} from '../controllers/habitController';
import { authenticateUser } from '../middleware/auth';

const router = Router();

router.use(authenticateUser);

router.get('/', getAll);
router.post('/', create);
router.put('/:id', update);
router.patch('/:id', changeStatus);

export default router;

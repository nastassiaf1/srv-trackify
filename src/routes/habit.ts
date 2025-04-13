import { Router } from 'express';
import {
  create,
  getAll,
  getById,
  update,
  updatePartial,
  markHabitDayAsDone,
} from '../controllers/habitController';
import { authenticateUser } from '../middleware/auth';

const router = Router();

router.use(authenticateUser);

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.patch('/:id/completed', markHabitDayAsDone);
router.patch('/:id', updatePartial);

export default router;

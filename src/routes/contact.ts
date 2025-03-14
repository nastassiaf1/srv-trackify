import { Router } from 'express';
import { sendMessage } from '../controllers/contactController';

const router = Router();

router.post('/send-message', sendMessage);

export default router;

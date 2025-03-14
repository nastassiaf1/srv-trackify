import { NextFunction, Request, Response } from 'express';
import { sendEmail } from '../services/contactService';

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      res.status(400).json({ message: 'All fields are required' });

      return;
    }

    const response = await sendEmail(name, email, message);

    if (response.success) {
      res.json({ message: 'Message sent successfully!' });

      return;
    } else {
      res.status(500).json({ message: 'Error sending message' });

      return;
    }
  } catch (err) {
    next();
  }
};

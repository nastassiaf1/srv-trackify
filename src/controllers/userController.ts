import { NextFunction, Request, Response } from 'express';
import { updateUser } from '../services/userService';

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;
    const userId = req.params.id;

    if (!token || !userId) {
      res.status(401).json({ message: 'No token provided' });

      return;
    }

    const updated = await updateUser(userId, req.body);

    res.json({ message: 'User updated', user: updated });

    next();
  } catch {
    res.status(401).json({ message: 'Invalid request' });
  }
};

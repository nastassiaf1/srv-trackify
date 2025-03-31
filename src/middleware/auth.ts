import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export interface AuthenticatedRequest extends Request {
  userId?: number;
}

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ message: 'No token provided' });

      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };

    const user = await User.findByPk(decoded.id);

    if (!user) {
      res.status(401).json({ message: 'Unauthorized' });

      return;
    }

    req.userId = user.getDataValue('id');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authorization error', error });
  }
};

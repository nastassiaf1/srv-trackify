import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Habit } from '../models/Habit';
import { createHabit } from '../services/habitService';
import { User } from '../models/User';

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };

    const user = await User.findByPk(decoded.id);
    const userId = user?.getDataValue('id');

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });

      return;
    }

    const habits = await Habit.findAll({
      where: { userId, isArchived: false },
    });

    res.json(habits);
  } catch (error) {
    next();
  }
};

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };

    const user = await User.findByPk(decoded.id);
    const userId = user?.getDataValue('id');

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });

      return;
    }

    const {
      title,
      description,
      frequencyType,
      repeatEveryXDays,
      daysOfWeek,
      reminders,
    } = req.body;

    const newHabit = await createHabit({
      title,
      description,
      frequencyType,
      repeatEveryXDays,
      daysOfWeek,
      reminders,
      userId,
    });

    res.status(201).json(newHabit);
  } catch (err) {
    next(err);
  }
};

/*export const getHabitById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const habit = await Habit.findOne({ where: { id, userId } });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch habit', error });
  }
};

export const updateHabit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const updatedData = req.body;

    const habit = await Habit.findOne({ where: { id, userId } });

    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    await habit.update(updatedData);

    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update habit', error });
  }
};

export const deleteHabit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const habit = await Habit.findOne({ where: { id, userId } });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    await habit.destroy();
    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete habit', error });
  }
};

export const completeHabit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const habit = await Habit.findOne({ where: { id, userId } });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    const completedDates = habit.completedDates
      ? [...habit.completedDates, new Date().toISOString()]
      : [new Date().toISOString()];

    await habit.update({ completedDates, streak: habit.streak + 1 });
    res.json({ message: 'Habit completed', habit });
  } catch (error) {
    res.status(500).json({ message: 'Failed to complete habit', error });
  }
};

export const archiveHabit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const habit = await Habit.findOne({ where: { id, userId } });
    if (!habit) return res.status(404).json({ message: 'Habit not found' });

    await habit.update({ isArchived: true });
    res.json({ message: 'Habit archived' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to archive habit', error });
  }
};
*/

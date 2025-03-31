import { Response, NextFunction } from 'express';
import { Habit } from '../models/Habit';
import { createHabit } from '../services/habitService';
import { AuthenticatedRequest } from '../middleware/auth';

export const getAll = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

    const habits = await Habit.findAll({
      where: { userId },
    });

    res.json(habits);
  } catch (error) {
    next();
  }
};

export const create = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.userId;

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
      userId: userId!,
    });

    res.status(201).json(newHabit);
  } catch (err) {
    next(err);
  }
};

export const update = async (
  req: AuthenticatedRequest,
  res: Response,
  _next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const updatedData = req.body;

    const habit = await Habit.findOne({ where: { id, userId } });

    if (!habit) {
      res.status(404).json({ message: 'Habit not found' });

      return;
    }

    await habit.update(updatedData);

    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update habit', error });
  }
};

export const changeStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  _next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const habit = await Habit.findOne({ where: { id, userId } });

    if (!habit) {
      res.status(404).json({ message: 'Habit not found' });

      return;
    }

    const { isArchived, isCompleted } = req.body;

    if (!isArchived && !isCompleted) {
      res.status(400).json({ message: 'Nothing to update' });
    }

    if (isArchived) {
      habit.setDataValue('isArchived', isArchived);
    }

    if (isCompleted) {
      habit.setDataValue('isCompleted', isCompleted);
    }

    await habit.save();

    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete habit', error });
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
*/

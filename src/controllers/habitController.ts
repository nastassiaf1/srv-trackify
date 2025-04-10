import { Response, NextFunction } from 'express';
import { Habit } from '../models/Habit';
import {
  createHabit,
  updateFields,
  updateStatus,
} from '../services/habitService';
import { AuthenticatedRequest } from '../middleware/auth';
import { HabitStatus } from '../constants';

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

export const getById = async (
  req: AuthenticatedRequest,
  res: Response,
  _next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const habit = await Habit.findOne({
      where: { id },
    });

    if (!habit) {
      res.status(404).json({ message: 'Habit not found' });

      return;
    }

    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch habit', error });
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

export const updatePartial = async (
  req: AuthenticatedRequest,
  res: Response,
  _next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { status } = req.query;
    const updates = req.body;

    let updatedHabit;

    if (status) {
      updatedHabit = await updateStatus(id, status as HabitStatus);
    }

    const allowedFields = [
      'title',
      'description',
      'color',
      'frequencyType',
      'repeatEveryXDays',
    ] as (keyof Partial<Habit>)[];

    const partialUpdates: Partial<Habit> = {};

    for (const key of allowedFields) {
      if (key in updates) {
        partialUpdates[key] = updates[key];
      }
    }

    if (Object.keys(partialUpdates).length > 0) {
      updatedHabit = await updateFields(id, partialUpdates);
    }

    if (!updatedHabit) {
      res.status(400).json({ message: 'No valid fields provided for update' });

      return;
    }

    res.json(updatedHabit);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update habit', error });
  }
};

/*
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

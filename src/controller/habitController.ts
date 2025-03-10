import { Request, Response } from 'express';
import { Habit } from '../models/Habit';

export const createHabit = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      frequencyType,
      daysOfWeek,
      repeatEveryXDays,
      reminders,
      hasEndDate,
      endDate,
    } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const habit = await Habit.create({
      title,
      description,
      frequencyType,
      daysOfWeek,
      repeatEveryXDays,
      reminders,
      hasEndDate,
      endDate,
      userId,
    });

    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create habit', error });
  }
};

export const getAllHabits = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const habits = await Habit.findAll({
      where: { userId, isArchived: false },
    });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch habits', error });
  }
};

export const getHabitById = async (req: Request, res: Response) => {
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

    // Добавляем текущую дату в список выполненных
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

import { Habit } from '../models/Habit';
import { HabitStatus } from './../constants';

interface CreateHabitInput {
  title: string;
  description?: string;
  frequencyType: 'daily' | 'weekly' | 'custom';
  repeatEveryXDays?: number | null;
  daysOfWeek?: number[] | null;
  reminders?: string[] | null;
  userId: number;
}

export const createHabit = async (data: CreateHabitInput) => {
  try {
    const habit = await Habit.create({
      title: data.title,
      description: data.description || null,
      frequencyType: data.frequencyType,
      repeatEveryXDays:
        data.frequencyType === 'custom' ? data.repeatEveryXDays : null,
      daysOfWeek: data.frequencyType === 'weekly' ? data.daysOfWeek : null,
      reminders: data.reminders || null,
      userId: data.userId,
    });

    return { success: true, habit };
  } catch (error) {
    console.error('Error creating habit:', error);

    return { success: false, message: 'Error creating habit' };
  }
};

export const updateStatus = async (id: string, status: HabitStatus) => {
  const habit = await Habit.findOne({ where: { id } });

  if (!habit) {
    throw new Error('Habit not found');
  }

  if (habit.getDataValue('isArchived')) {
    throw new Error('Archived habits cannot be modified');
  }

  if (status === 'archived') {
    habit.setDataValue('isArchived', true);
    habit.setDataValue('isCompleted', false);
  } else if (status === 'completed') {
    habit.setDataValue('isCompleted', true);
  } else if (status === 'active') {
    habit.setDataValue('isCompleted', false);
  }

  await habit.save();

  return habit;
};

export const updateFields = async (
  id: string,
  updates: Partial<{ color: string; title: string; description: string }>,
) => {
  const habit = await Habit.findOne({ where: { id } });

  if (!habit) {
    throw new Error('Habit not found');
  }

  if (updates.color) {
    habit.setDataValue('color', updates.color);
  }

  await habit.save();

  return habit;
};

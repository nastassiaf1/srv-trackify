import { Habit } from '../models/Habit';

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

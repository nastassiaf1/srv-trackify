import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../configs/database';

export class Habit extends Model {
  public id!: number;
  public title!: string;
  public description!: string | null;
  public icon!: string | null;
  public frequencyType!: 'daily' | 'weekly' | 'custom';
  public daysOfWeek!: number[] | null;
  public repeatEveryXDays!: number | null;
  public reminders!: string[] | null;
  public completedDates!: string[];
  public streak!: number;
  public hasEndDate!: boolean;
  public endDate!: Date | null;
  public isArchived!: boolean;
  public isCompleted!: boolean;
  public completedAt!: Date | null;
  public userId!: number;

  public async markAsCompleted(date: string): Promise<void> {
    this.completedDates.push(date);
    this.streak += 1;

    await this.save();
  }

  public async resetHabit(): Promise<void> {
    this.completedDates = [];
    this.streak = 0;

    await this.save();
  }

  public async archiveHabit(): Promise<void> {
    this.isArchived = true;

    await this.save();
  }

  public async completeHabit(): Promise<void> {
    this.isCompleted = true;
    this.completedAt = new Date();

    await this.save();
  }
}

Habit.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    icon: { type: DataTypes.STRING, allowNull: true },
    frequencyType: {
      type: DataTypes.ENUM('daily', 'weekly', 'custom'),
      allowNull: false,
    },
    daysOfWeek: { type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: true },
    repeatEveryXDays: { type: DataTypes.INTEGER, allowNull: true },
    reminders: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
    completedDates: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    streak: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    hasEndDate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    endDate: { type: DataTypes.DATE, allowNull: true },
    isArchived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    completedAt: { type: DataTypes.DATE, allowNull: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
  },
  { sequelize, tableName: 'habits' },
);

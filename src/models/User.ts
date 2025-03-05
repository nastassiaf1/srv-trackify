import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../configs/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Role } from '../constants';

export class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string | null;
  public role!: string;
  public displayName!: string | null;
  public avatar!: string | null;

  generateToken() {
    return jwt.sign(
      { id: this.get('id'), email: this.get('email'), role: this.get('role') },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' },
    );
  }

  async checkPassword(password: string): Promise<boolean> {
    if (!this.password) return false;

    return bcrypt.compare(password, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: Role.USER,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
  },
);

User.beforeCreate(async (user: User) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

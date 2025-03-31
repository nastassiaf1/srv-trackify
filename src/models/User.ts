import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../configs/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Role } from '../constants';

export class User extends Model {
  generateToken() {
    return jwt.sign(
      {
        id: this.getDataValue('id'),
        email: this.getDataValue('email'),
        role: this.getDataValue('role'),
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' },
    );
  }

  async checkPassword(password: string): Promise<boolean> {
    const passwordToCompare = this.getDataValue('password');

    if (!passwordToCompare) return false;

    return bcrypt.compare(password, passwordToCompare);
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
      field: 'display_name',
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
    underscored: true,
  },
);

User.beforeCreate(async (user: User) => {
  const password = user.getDataValue('password') as string | null;

  if (password) {
    user.setDataValue('password', await bcrypt.hash(password, 10));
  }
});

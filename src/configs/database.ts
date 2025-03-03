import { Sequelize } from 'sequelize';
import { CONFIG } from './config';

export const sequelize = new Sequelize(
  CONFIG.DB_NAME!,
  CONFIG.DB_USER!,
  CONFIG.DB_PASS!,
  {
    host: CONFIG.DB_HOST!,
    port: CONFIG.DB_PORT,
    dialect: 'postgres',
    logging: false,
  },
);

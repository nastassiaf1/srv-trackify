import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const environment = process.env.NODE_ENV || 'development';
const config = require(`./config.${environment}.ts`);

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect as 'postgres',
    logging: false,
  },
);

export default sequelize;

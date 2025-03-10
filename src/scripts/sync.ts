import { sequelize } from '../configs/database';
import '../models/User';
import '../models/Habit';

// npx ts-node src/scripts/sync.ts

if (process.env.NODE_ENV === 'production') {
  console.error("❌ ERROR: sync.ts don't run it in production!");
  process.exit(1);
}

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected!');

    await sequelize.sync({ force: true });
    console.log('✅ Tables synchronized!');

    process.exit();
  } catch (error) {
    console.error('❌ Error syncing database:', error);
    process.exit(1);
  }
};

syncDatabase();

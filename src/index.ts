import express from 'express';
import session from 'express-session';
import cors from 'cors';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { sequelize } from './configs/database';
import { CONFIG } from './configs/config';
import { logger } from './middleware/logger';
import authRoutes from './routes/auth';
import contactRoutes from './routes/contact';
import userRoutes from './routes/user';

import './configs/passport';

const app = express();
const PORT = CONFIG.PORT || 5000;

app.use(
  cors({
    origin: process.env.REACT_APP_API_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: CONFIG.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(logger);

app.use('/auth', authRoutes);
app.use('/contact', contactRoutes);
app.use('/users', userRoutes);

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();

    console.log(`🚀 Server running on port ${PORT}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
});

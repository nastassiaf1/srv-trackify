import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import { User } from '../models/User';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });

      return;
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });

      return;
    }

    const user = await User.create({ email, password, role });

    res
      .status(201)
      .json({ message: 'User created', token: user.generateToken() });
  } catch (error) {
    next(error);
  }
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.checkPassword(password))) {
      res.status(401).json({ message: 'Invalid email or password' });

      return;
    }

    res.json({ message: 'Login successful', token: user.generateToken() });
  } catch (error) {
    next(error);
  }
};

const googleAuth: RequestHandler = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

const googleAuthCallback: RequestHandler = passport.authenticate('google', {
  failureRedirect: '/auth/failure',
});

const googleLogin: RequestHandler = (req, res) => {
  const user = req.user as User;

  if (!user) {
    res.status(401).json({ message: 'Authentication failed' });

    return;
  }

  const token = user.generateToken();

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  if (process.env.REACT_APP_API_URL) {
    res.redirect(process.env.REACT_APP_API_URL);
  }
};

const logout: RequestHandler = (_req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};

const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ message: 'Access denied' });

      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };

    const user = await User.findByPk(decoded.id);

    if (!user) {
      res.status(401).json({ message: 'User not found' });

      return;
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
};

router.post('/register', register);
router.post('/login', login);
router.get('/google', googleAuth);
router.get('/google/callback', googleAuthCallback, googleLogin);
router.post('/logout', logout);
router.get('/user', getUser);

export default router;

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/User';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const avatar = profile.photos?.[0]?.value || null;
        const displayName = profile.displayName || null;

        if (!email || !email.endsWith('@gmail.com')) {
          return done(null, false, { message: 'Only Gmail accounts allowed' });
        }

        let user = await User.findOne({ where: { email } });

        if (!user) {
          user = await User.create(
            {
              email,
              displayName,
              avatar,
            },
            { returning: true },
          );
        } else {
          if (avatar) {
            user.setDataValue('avatar', avatar);
          }

          if (displayName) {
            user.setDataValue('displayName', displayName);
          }

          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    },
  ),
);

passport.serializeUser((user: any, done) => {
  done(null, user?.dataValues.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id as string);

    done(null, user?.dataValues);
  } catch (error) {
    done(error, null);
  }
});

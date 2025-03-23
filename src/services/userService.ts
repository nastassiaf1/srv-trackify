import { UpdateUserPayload } from '../interfaces/user';
import { User } from '../models/User';

export const updateUser = async (
  userId: string,
  payload: UpdateUserPayload,
) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const { displayName, avatar } = payload;

  if (displayName !== undefined) user.set('displayName', displayName);
  if (avatar !== undefined) user.set('avatar', avatar);

  await user.save();

  return user;
};

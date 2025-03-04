import asyncHandler from 'express-async-handler';
import { setRedisSessionWithExipiry, getRedisSession } from '../helpers/redis.js';

export const getUsers = asyncHandler(async (req, res) => {
  const cachedUsers = await getRedisSession('users');
  if (cachedUsers) {
    return res.json(JSON.parse(cachedUsers));
  }
  const users = [{ name: 'User1' }, { name: 'User2' }];
  await setRedisSessionWithExipiry('users', JSON.stringify(users), 3600);
  res.json(users);
});

import { redisInstance } from '../config/redis.js';
import { sanitizeObj } from '../utils/common.js'

const redisClient = redisInstance.getClient();

export async function setRedisSession(key, value) {
  const _value = JSON.stringify(sanitizeObj(value));
  const result = await redisClient.set(key,_value);
  if(!result) return null;
  return JSON.parse(result);
  // return new Promise((resolve, reject) => {
  //   const _value = JSON.stringify(sanitizeObj(value));
  //   redisClient.set(key, _value, (err, response) => {
  //     if (err) return reject(err);
  //     resolve(response);
  //   });
  // });
}

export function setRedisSessionWithExipiry(key, value, expire) {
  return new Promise((resolve, reject) => {
    const _value = JSON.stringify(sanitizeObj(value));
    redisClient.set(key, _value, (err, response) => {
      if (err) return reject(err);
      redisClient.expire(key, parseInt(expire, 10));
      resolve(response);
    });
  });
}

export async function getRedisSession(key) {
  const result = await redisClient.get(key);
  if(!result) return null;
  return JSON.parse(result);
}

export function delRedisSession(key) {
  return new Promise((resolve, reject) => {
    redisClient.del(key, (err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

export function setAttemptCount(key, expire) {
  redisClient.exists(key, (err, reply) => {
    if (reply === 1) redisClient.incr(key);
    else redisClient.set(key, 1);
    redisClient.expire(key, parseInt(expire, 10));
  });
}

export async function getAttemptCount(key) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, reply) => {
      if (err) reject(err);
      return resolve(reply ? parseInt(reply, 10) : 0);
    });
  });
}

export async function checkMemberInSet(setName, value) {
  return new Promise((resolve, reject) => {
    redisClient.sismember(setName, value, (err, response) => {
      if (err) {
        return reject(err);
      }
      if (response === 0) {
        return resolve(false);
      }
      if (response === 1) {
        return resolve(true);
      }
    });
  });
}

export async function incrRedisSession(key) {
  return new Promise((resolve, reject) => {
    redisClient.incr(key, (err, reply) => {
      if (err) reject(err);
      return resolve(reply ? parseInt(reply, 10) : 0);
    });
  });
}

export async function keyExist(key) {
  return new Promise((resolve, reject) => {
    redisClient.exists(key, (err, reply) => {
      if (err) reject(err);
      return resolve(reply ? parseInt(reply, 10) : 0);
    });
  });
}

export async function setRateLimitCount(key, expire) {
  const exist = await keyExist(key);
  if (exist === 1) return incrRedisSession(key);
  await setRedisSessionWithExipiry(key, 1, expire);
  return 1;
}

export function setnxWithExpiry(key, value, expire) {
  return new Promise((resolve, reject) => {
    const _value = JSON.stringify(sanitizeObj(value));
    redisClient.set(key, _value, 'NX', 'EX', parseInt(expire, 10), (err, response) => {
      if (err) return reject(err);
      resolve(response);
    });
  });
}

// module.exports = {
//   setRedisSession,
//   getRedisSession,
//   delRedisSession,
//   setAttemptCount,
//   getAttemptCount,
//   setRedisSessionWithExipiry,
//   checkMemberInSet,
//   incrRedisSession,
//   setRateLimitCount,
//   setnxWithExpiry,
// };

import jwt from 'jsonwebtoken';
import { Context } from 'koa';

import secret from '../config/jwt';

export const generateToken = (uid: number, userName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign({
      id: uid,
      userName
    }, secret, {
      expiresIn: '7d',
      issuer: 'wolfonair-local',
      subject: 'user'
    }, (err, token) => {
      if (err) {
        reject(err);
      }

      resolve(token as string);
    })
  });
}

export const decodeToken = (token: string) => {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject();
    }
    
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      }

      resolve(decoded);
    })
  });
};

export const setAccessTokenCookie = (ctx: Context, token: string) => {
  ctx.cookies.set('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
}

export const getAccessTokenCookie = (ctx: Context): string => {
  const token = ctx.cookies.get('access_token');

  if (!token) {
    return '';
  }

  return token
}

import Router from 'koa-router';
import crypto from 'crypto';

import { querySql } from '../lib/db';
 
const user = new Router();

user.get('/email/:eamil', async (ctx, next) => {
  const { email } = ctx.params;

  try {
    const rows: any = await querySql(`SELECT uid FROM user WHERE email='${email}'`);

    ctx.body = {
      isOk: rows.length <= 0
    }
    ctx.status = 200;
  
  } catch (e) {
    ctx.throw(e);
    ctx.status = 500;
  }
});

user.get('/userName/:userName', async (ctx, next) => {
  const { userName } = ctx.params;

  try {
    const rows: any = await querySql(`SELECT uid FROM user WHERE userName='${userName}'`);

    ctx.body = {
      isOk: rows.length <= 0
    }
    ctx.status = 200;
  
  } catch (e) {
    ctx.throw(e);
    ctx.status = 500;
  }
});

user.post('/join', (ctx) => {
  const { body } = ctx.request;
  const { email, password, userName } = body;

  crypto.randomBytes(64, (err, buf) => {
    const salt = buf.toString('base64');
    
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', async (err, key) => {
      try {
        await querySql(`INSERT INTO user(email, userName, password, salt) VALUES('${email}', '${userName}', '${key.toString('base64')}', '${salt}')`);
    
      } catch (e) {
        ctx.throw(e);
        ctx.status = 500;
      }  
    });
  });
});

export default user;
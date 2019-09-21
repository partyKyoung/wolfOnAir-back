import Router from 'koa-router';
import crypto from 'crypto';

import querySql from '../lib/db';
import getHash from '../lib/crypto';
import sendEmail from '../lib/email';

const user = new Router();

user.get('/email/:email', async (ctx, next) => {
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

user.post('/join', async (ctx) => {
  const { body } = ctx.request;
  const { email, password, userName } = body;

  try {
    const cryptoPassword = await getHash(password);
    const { key, salt } = cryptoPassword;

    await querySql(
      `INSERT INTO user(email, userName, password, salt) VALUES('${email}', '${userName}', '${key}', '${salt}')`
    );
    
    ctx.status = 200;
  } catch (e) {
    ctx.throw(e);
    ctx.throw(500, e);
  }
});

user.post('/join/send-email', async (ctx) => {
  try {
    const { email } = ctx.request.body;
    const values = {
      body: `<table><tbody><tr><td>회원가입을 완료 하시려면 하단의 버튼을 눌러주세요!</td<</tr><tr><td><a href="https://wolfonair.io">가입 완료</a></td></tr></tbody></table>`,
      subject: '회원가입 확인 이메일',
      to: [email]
    };
    
    await sendEmail(values);
   } catch (e) {
    ctx.throw(500, e);
  }
});

export default user;
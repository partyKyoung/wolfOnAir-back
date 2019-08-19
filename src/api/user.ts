import Router from 'koa-router';

import db from '../lib/db';
 
const user = new Router();

user.get('/email/:eamil', async (ctx, next) => {
  const { email } = ctx.params;

  ctx.status = 200;
  ctx.body = {
    isOk: true
  };

  // try {
  //   const [rows] = await db.execute('SELECT * FROM `user` WHERE `email` = ?', [email]);

  //   ctx.status = 200;
  //   ctx.body = {
  //     isOk: rows.length <= 0
  //   };

  //   return;

  // } catch (e) {
  //   ctx.throw(500, e);
  // }

});

export default user;
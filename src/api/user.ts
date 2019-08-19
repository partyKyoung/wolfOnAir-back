import Router from 'koa-router';

import db from '../lib/db';
 
const user = new Router();

user.get('/email/:eamil', async (ctx, next) => {
  const { email } = ctx.params;
  // const connection = await db();

  ctx.body = {
    isOK:false
  }
});

export default user;
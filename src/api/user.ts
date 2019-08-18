import Router from 'koa-router';
import mysql from 'mysql';

const userRouter = new Router();

userRouter.get('/email/:email', (ctx) => {
  ctx.status = 200;
  ctx.body = {
    isOk: true
  }
});

export default userRouter;
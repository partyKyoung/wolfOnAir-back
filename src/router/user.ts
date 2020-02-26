import Router from 'koa-router';

const router = new Router();

router.get('/user/email/:email', (ctx) => {
  ctx.status = 200;
  ctx.body = {
    isOk: true
  }
});

export default router;
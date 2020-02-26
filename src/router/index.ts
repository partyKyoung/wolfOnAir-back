import Router from 'koa-router';

const router = new Router();

router.get('/hello', (ctx) => {
  ctx.body = "허접새끼"
});

export default router;
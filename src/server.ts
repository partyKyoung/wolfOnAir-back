import Koa from 'koa';
import Router from 'koa-router';
import koaBody from 'koa-body';
import serverless from 'serverless-http';
import api from './api';

const app = new Koa();
const router = new Router();

// 라우터 설정
router.use('/api', api.routes());

// cors
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');
  // ctx.set("Access-Control-Allow-Credentials", true);
  await next();
});

app.use(koaBody({
  multipart: true,
}));
app.use(router.routes()).use(router.allowedMethods());

// 개발 환경에서만 koa 서버 실행
if (process.env.NODE_ENV === 'development') {
  app.listen(8080);
}


export const handler = serverless(app);
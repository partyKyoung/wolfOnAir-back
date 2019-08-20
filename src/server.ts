import Koa from 'koa';
import Router from 'koa-router';
import serverless from 'serverless-http';
import api from './api';

const app: any = new Koa();
const router = new Router();

// cors
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*');

  await next();
});

// 라우터 설정
router.use('/api', api.routes());

app.use(router.routes()).use(router.allowedMethods());

// 개발 환경에서만 koa 서버 실행
if (process.env.NODE_ENV === 'development') {
  app.listen(8080, (err: any) => {
    if (err) {
      return;
    }

    console.log('Server is running on port 8080');
  });
}


export const handler = serverless(app);
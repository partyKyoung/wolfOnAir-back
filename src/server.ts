import Koa from 'koa';
import serverless from 'serverless-http';
import userRouter from './router/user';

const app: any = new Koa();

// cors
app.use((ctx) => {
  console.log(ctx);
  if (ctx.headers.referer && ctx.headers.referer.indexOf('localhost:3000') > -1) {
    ctx.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  }
});

// app.use(userRouter.routes()).use(userRouter.allowedMethods());

app.use((ctx: any) => {
  ctx.body = 'hello world';
});

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
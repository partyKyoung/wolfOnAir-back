import Koa from 'koa';
import serverless from 'serverless-http'; // koa, express 같은 프레임워크들을 사용할 수 있도록 도와줌.

const app: any = new Koa();

app.use((ctx: any) => {
  ctx.body = 'hello world';
});

app.listen(8080, (err: any) => {
  if (err) {
    return;
  }
  console.log('Server is running on port 8080');
});

export const handler = serverless(app);
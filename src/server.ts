import Koa from 'koa';
import serverless from 'serverless-http';

const app: any = new Koa();

app.use((ctx: any) => {
  ctx.body = 'hello world';
});

if (process.env.NODE_ENV === 'development') {
  app.listen(8080, (err: any) => {
    if (err) {
      console.log(err);

      return;
    }
    console.log('Server is running on port 8080');
  });
}


export const handler = serverless(app);

import { Context } from 'koa';
import Router from 'koa-router';

const user = new Router();

user.get('/email/:email', (ctx: Context) => {
  
});

user.get('/userName/:userName', (ctx: Context) => {

});

user.post('/join', async (ctx: Context) => {
  
});

user.post('/join/send-email', async (ctx: Context) => {
  
});

export default user;
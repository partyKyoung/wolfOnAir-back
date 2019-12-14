import { Context } from 'koa';
import Router from 'koa-router';

import {
  checkEmail,
  checkUserName,
  join,
  sendJoinEmail
} from './user.ctrl';

const user = new Router();

user.get('/email/:email', checkEmail);

user.get('/userName/:userName', checkUserName);

user.post('/join', join);

user.post('/join/send-email', sendJoinEmail);

export default user;


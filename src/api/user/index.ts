import Router from '@koa/router';

import {
  checkEmail,
  checkUserName,
  join,
  sendJoinEmail
} from './user.ctrl';

const user = new Router();

user.get('/join/availability-email/:email', checkEmail);

user.get('/join/availability-nickname/:userName', checkUserName);

user.post('/join', join);

user.post('/join/send-email', sendJoinEmail);

export default user;


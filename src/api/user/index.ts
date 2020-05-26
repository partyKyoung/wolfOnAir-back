import Router from '@koa/router';

import {
  checkEmail,
  checkUserName,
  join,
  login,
  logout,
  sendJoinEmail,
  updateUserEmailAuth,
  checkStatus
} from './user.ctrl';

const user = new Router();

user.get('/join/availability-email/:email', checkEmail);

user.get('/join/availability-nickname/:userName', checkUserName);

user.post('/join', join);

user.post('/join/auth', sendJoinEmail);

user.put('/join/auth', updateUserEmailAuth);

user.post('/login', login);

user.post('/logout', logout);

user.get('/check-status', checkStatus);

export default user;


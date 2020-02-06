import Router from '@koa/router';

import {
  sendJoinAuthHelpEmail
} from './help.ctrl';

const help = new Router();

help.post('/join/auth-email', sendJoinAuthHelpEmail);

export default help;


import Router from '@koa/router';

import help from './help';
import user from './user';

const api = new Router();

api.use('/help', help.routes());
api.use('/user', user.routes());

export default api;
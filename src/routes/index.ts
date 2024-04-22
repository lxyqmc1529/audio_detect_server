import Application from 'koa';
import userRouter from './user';
import audioRouter from './audio';

export default function createRouter(app: Application) {
  app.use(userRouter.routes()).use(userRouter.allowedMethods());
  app.use(audioRouter.routes()).use(audioRouter.allowedMethods());
}
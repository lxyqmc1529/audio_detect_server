import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from '@koa/bodyparser';
import koaSession from 'koa-session';
import koaJwt from 'koa-jwt';
import koaStatic from 'koa-static';
import koaMount from 'koa-mount';
import path from 'path';
import transform from './middleware/transform.middleware';
import createRouter from './routes';
import { bootstrap } from './lib/bootstrap';
import { sessionConfig, APP, UnlessLogin } from './config';
import 'reflect-metadata';
import axios from 'axios';

bootstrap().then(() => {
  const app = new Koa();
  // 跨域中间件
  app.use(cors({
    credentials: true,
  }));
  app.use(bodyParser());
  app.use(transform());
  app.use(koaSession(sessionConfig, app));
  app.use(koaMount('/public', koaStatic(path.resolve(process.cwd(), 'static'))));
  app.use(
    koaJwt({
      secret: APP.jwtKey,
      getToken: (ctx) => ctx.headers['x-token'] as string,
    }).unless({ path: UnlessLogin })
  );
  createRouter(app);

  app.listen(8080, () => {
    console.log('server start 8080');
  });
});

import Router from '@koa/router';
import userController from '@app/controller/user.controller';

const router = new Router({ prefix: '/v1/user' });

router.post('/register', userController.register);
router.get('/captcha', userController.getCaptcha);
router.post('/login', userController.login);
router.get('/', userController.getUserInfo);

export default router;
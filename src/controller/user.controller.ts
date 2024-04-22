import { Context } from "koa";
import bcrypto from 'bcrypt';
import svgCaptcha from 'svg-captcha';
import jwt from 'jsonwebtoken';
import userService from '@app/service/user.service';
import { UserDTO } from '@app/dto';
import { APP } from '@app/config';
import { ServiceError } from '@app/errors';

class UserController {
  async getCaptcha(ctx: Context) {
    const cap = svgCaptcha.create({
      size: 4,
      width: 120,
      height: 40,
      fontSize: 45,
      ignoreChars: "0oO1ilI",
      noise: 3,
      color: true,
      background: "#eee",
    });
    const img = Buffer.from(cap.data).toString("base64");
	  const base64Img = "data:image/svg+xml;base64," + img;
	  const text = cap.text.toLowerCase();
	  ctx.session.captcha = text;
    ctx.success({
      imgUrl: base64Img,
    });
  }

  async register(ctx: Context) {
    // 获取请求数据
    const data = ctx.request.body;
    // 校验数据是否合法
    const { error } = UserDTO.registerDto.validate(data);
    if (error) {
      return ctx.fail(error);
    }
    // 判断用户名是否已经存在
    const hasUser = await userService.findByName(data.username);
    if (hasUser) {
      return ctx.fail(ServiceError[20001]);
    }
    // 密码加密存储
    data.password = bcrypto.hashSync(data.password, 10);
    // 存储用户信息
    const saveUser = await userService.save(data);
    delete saveUser.password;
    ctx.success(saveUser);
  }

  async login(ctx: Context) {
    const data = ctx.request.body;
    // 校验数据是否合法
    const { error } = UserDTO.loginDto.validate(data);
    if (error) {
      return ctx.fail(error);
    }
    // 验证码校验
    if (data.captcha.toLowerCase() !== ctx.session.captcha?.toLowerCase()) {
      return ctx.fail(ServiceError[20003]);
    }
    const userInfo = await userService.findByName(data.username);
    if (!userInfo) {
      return ctx.fail(ServiceError[20002]);
    }
    if (!bcrypto.compareSync(data.password, userInfo.password)) {
      return ctx.fail(ServiceError[20002]);
    }
    const token = jwt.sign({
      id: userInfo.id,
      username: userInfo.username,
    }, APP.jwtKey, {
      expiresIn: '24h'
    });
    return ctx.success({ token })
  }

  async getUserInfo(ctx: Context) {
    const tokenUser = ctx.state.user;
    const userInfo = await userService.findById(tokenUser.id);
    delete userInfo.password;
    return ctx.success(userInfo);
  }
}

export default new UserController();
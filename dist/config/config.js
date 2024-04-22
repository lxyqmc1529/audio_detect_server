"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XunFei = exports.UnlessLogin = exports.APP = void 0;
exports.APP = {
    jwtKey: '$audio_detect_server',
};
exports.UnlessLogin = [
    /^\/v1\/user\/login/,
    /^\/v1\/user\/register/,
    /^\/v1\/user\/captcha/,
    /^\/public\/.*/,
];
exports.XunFei = {
    appId: 'c4305d0a',
    secret: 'd639f81cd06ebb7916aa0651ea41ae34'
};
//# sourceMappingURL=config.js.map
export const APP = {
  jwtKey: '$audio_detect_server',
};

export const UnlessLogin = [
  /^\/v1\/user\/login/,
  /^\/v1\/user\/register/,
  /^\/v1\/user\/captcha/,
  /^\/public\/.*/,
];

export const XunFei = {
  appId: 'c4305d0a',
  secret: 'd639f81cd06ebb7916aa0651ea41ae34'
}
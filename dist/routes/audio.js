"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("@koa/router"));
const koa_multer_1 = __importDefault(require("koa-multer"));
const path_1 = __importDefault(require("path"));
const audio_controller_1 = __importDefault(require("../controller/audio.controller"));
const sse_middleware_1 = require("../middleware/sse.middleware");
const router = new router_1.default({ prefix: '/v1/audio' });
const staticDir = path_1.default.resolve(process.cwd(), 'static');
const storage = koa_multer_1.default.diskStorage({
    destination(req, file, cb) {
        cb(null, staticDir);
    },
    filename(req, file, cb) {
        const { name, ext } = path_1.default.parse(file.originalname);
        cb(null, name + '-' + Date.now() + ext);
    }
});
const upload = (0, koa_multer_1.default)({ storage });
router.get('/sse', sse_middleware_1.sse);
router.post('/upload', upload.array('audio'), audio_controller_1.default.uploadAudio);
router.post('/detect', audio_controller_1.default.detectAudio);
router.get('/getAll', audio_controller_1.default.getAllAudios);
router.post('/:id', audio_controller_1.default.updateAudioInfo);
exports.default = router;
//# sourceMappingURL=audio.js.map
import Router from '@koa/router';
import multer from 'koa-multer';
import path from 'path';
import audioController from '@app/controller/audio.controller';
import { sse } from '@app/middleware/sse.middleware';

const router = new Router({ prefix: '/v1/audio' });

const staticDir = path.resolve(process.cwd(), 'static');
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, staticDir);
  },
  filename(req, file, cb) {
    const { name, ext } = path.parse(file.originalname);
    cb(null, name + '-' + Date.now() + ext)
  }
})
const upload = multer({ storage });

router.get('/sse', sse);
router.post('/upload', upload.array('audio'), audioController.uploadAudio);
router.post('/detect', audioController.detectAudio);
router.get('/list', audioController.listAudios);
router.post('/:id', audioController.updateAudioInfo);
router.get('/getAll', audioController.getAll);

export default router;
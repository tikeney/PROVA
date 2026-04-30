import { Router } from 'express';
import AuthController from '../controllers/AuthController.js';
import { autenticar } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/login', AuthController.login);
router.post('/registro', AuthController.registro);
router.get('/me', autenticar, AuthController.me);

export default router;

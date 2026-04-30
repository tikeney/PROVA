import { Router } from 'express';
import UsuarioController from '../controllers/UsuarioController.js';
import { autenticar } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', autenticar, UsuarioController.listarTodos);
router.get('/:id', autenticar, UsuarioController.buscarPorId);
router.put('/:id', autenticar, UsuarioController.atualizar);
router.delete('/:id', autenticar, UsuarioController.excluir);

export default router;

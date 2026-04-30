import { Router } from 'express';
import MovimentacaoController from '../controllers/MovimentacaoController.js';
import { autenticar } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', autenticar, MovimentacaoController.listarTodos);
router.get('/produto/:id_produto', autenticar, MovimentacaoController.buscarPorProduto);
router.get('/:id', autenticar, MovimentacaoController.buscarPorId);
router.post('/', autenticar, MovimentacaoController.criar);

export default router;

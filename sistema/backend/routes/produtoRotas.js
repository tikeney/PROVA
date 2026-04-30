import { Router } from 'express';
import ProdutoController from '../controllers/ProdutoController.js';
import { autenticar } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/estoque-baixo', autenticar, ProdutoController.estoqueBaixo);
router.get('/', autenticar, ProdutoController.listarTodos);
router.get('/:id', autenticar, ProdutoController.buscarPorId);
router.post('/', autenticar, ProdutoController.criar);
router.put('/:id', autenticar, ProdutoController.atualizar);
router.delete('/:id', autenticar, ProdutoController.excluir);

export default router;

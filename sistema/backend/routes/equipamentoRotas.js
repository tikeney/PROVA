import express from 'express';
import EquipamentoController from '../controllers/EquipamentoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// TODO: Decida quais rotas precisam de autenticação (adicione authMiddleware)

// GET /api/equipamentos
router.get('/', EquipamentoController.listarTodos);

// GET /api/equipamentos/:id
router.get('/:id', EquipamentoController.buscarPorId);

// POST /api/equipamentos
router.post('/', EquipamentoController.criar);

// PUT /api/equipamentos/:id
router.put('/:id', EquipamentoController.atualizar);

// DELETE /api/equipamentos/:id
router.delete('/:id', EquipamentoController.excluir);

export default router;

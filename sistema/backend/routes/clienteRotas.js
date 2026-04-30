import express from 'express';
import ClienteController from '../controllers/ClienteController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// TODO: Decida quais rotas precisam de autenticação (adicione authMiddleware)

// GET /api/clientes
router.get('/', ClienteController.listarTodos);

// GET /api/clientes/:id
router.get('/:id', ClienteController.buscarPorId);

// POST /api/clientes
router.post('/', ClienteController.criar);

// PUT /api/clientes/:id
router.put('/:id', ClienteController.atualizar);

// DELETE /api/clientes/:id
router.delete('/:id', ClienteController.excluir);

export default router;

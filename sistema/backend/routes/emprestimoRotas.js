import express from 'express';
import EmprestimoController from '../controllers/EmprestimoController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// TODO: Decida quais rotas precisam de autenticação (adicione authMiddleware)

// GET /api/emprestimos
router.get('/', EmprestimoController.listarTodos);

// GET /api/emprestimos/em-aberto
// ATENÇÃO: Esta rota deve vir ANTES de /:id para não ser interceptada
router.get('/em-aberto', EmprestimoController.listarEmAberto);

// GET /api/emprestimos/:id
router.get('/:id', EmprestimoController.buscarPorId);

// POST /api/emprestimos - Registrar saída (novo empréstimo)
router.post('/', EmprestimoController.registrarSaida);

// PUT /api/emprestimos/:id/devolver - Registrar devolução
router.put('/:id/devolver', EmprestimoController.registrarDevolucao);

export default router;

import MovimentacaoModel from '../models/MovimentacaoModel.js';
import ProdutoModel from '../models/ProdutoModel.js';
import UsuarioModel from '../models/UsuarioModel.js';
import { update } from '../config/database.js';

class MovimentacaoController {
    // GET /api/movimentacoes
    static async listarTodos(req, res) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = parseInt(req.query.limite) || 10;
            const resultado = await MovimentacaoModel.listarTodos(pagina, limite);
            res.json({ sucesso: true, ...resultado });
        } catch (error) {
            console.error(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar movimentações' });
        }
    }

    // GET /api/movimentacoes/:id
    static async buscarPorId(req, res) {
        try {
            const mov = await MovimentacaoModel.buscarPorId(req.params.id);
            if (!mov) return res.status(404).json({ sucesso: false, mensagem: 'Movimentação não encontrada' });
            res.json({ sucesso: true, movimentacao: mov });
        } catch (error) {
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar movimentação' });
        }
    }

    // GET /api/movimentacoes/produto/:id_produto
    static async buscarPorProduto(req, res) {
        try {
            const movimentacoes = await MovimentacaoModel.buscarPorProduto(req.params.id_produto);
            res.json({ sucesso: true, movimentacoes });
        } catch (error) {
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar movimentações do produto' });
        }
    }

    // POST /api/movimentacoes
    static async criar(req, res) {
        try {
            const { tipo_movimentacao, quantidade, data_movimentacao, id_produto, id_usuario } = req.body;
            if (!tipo_movimentacao || !quantidade || !data_movimentacao || !id_produto || !id_usuario) {
                return res.status(400).json({ sucesso: false, mensagem: 'Todos os campos são obrigatórios' });
            }
            if (!['Entrada', 'Saida'].includes(tipo_movimentacao)) {
                return res.status(400).json({ sucesso: false, mensagem: 'tipo_movimentacao deve ser "Entrada" ou "Saida"' });
            }
            const produto = await ProdutoModel.buscarPorId(id_produto);
            if (!produto) return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado' });

            const usuario = await UsuarioModel.buscarPorId(id_usuario);
            if (!usuario) return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });

            const qtd = parseInt(quantidade);
            if (tipo_movimentacao === 'Saida' && produto.estoque_atual < qtd) {
                return res.status(400).json({ sucesso: false, mensagem: 'Estoque insuficiente para a saída' });
            }

            const id = await MovimentacaoModel.criar({ tipo_movimentacao, quantidade: qtd, data_movimentacao, id_produto, id_usuario });

            // Atualizar estoque
            const novoEstoque = tipo_movimentacao === 'Entrada'
                ? produto.estoque_atual + qtd
                : produto.estoque_atual - qtd;
            await update('Produtos', { estoque_atual: novoEstoque }, `id_produto = ${id_produto}`);

            const movimentacao = await MovimentacaoModel.buscarPorId(id);
            res.status(201).json({ sucesso: true, movimentacao });
        } catch (error) {
            console.error(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao registrar movimentação' });
        }
    }
}

export default MovimentacaoController;

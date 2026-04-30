import { create, query } from '../config/database.js';

class MovimentacaoModel {
    static async listarTodos(pagina = 1, limite = 10) {
        const offset = (pagina - 1) * limite;
        const movimentacoes = await query(
            `SELECT m.*, p.nome as nome_produto, u.nome_usuario
             FROM Movimentacao m
             LEFT JOIN Produtos p ON m.id_produto = p.id_produto
             LEFT JOIN Usuarios u ON m.id_usuario = u.id_usuario
             ORDER BY m.id_movimentacao DESC LIMIT ? OFFSET ?`,
            [limite, offset]
        );
        const totais = await query('SELECT COUNT(*) as total FROM Movimentacao');
        const total = totais[0].total;
        return { movimentacoes, total, pagina, limite, totalPaginas: Math.ceil(total / limite) };
    }

    static async buscarPorId(id) {
        const rows = await query(
            `SELECT m.*, p.nome as nome_produto, u.nome_usuario
             FROM Movimentacao m
             LEFT JOIN Produtos p ON m.id_produto = p.id_produto
             LEFT JOIN Usuarios u ON m.id_usuario = u.id_usuario
             WHERE m.id_movimentacao = ?`,
            [id]
        );
        return rows[0] || null;
    }

    static async buscarPorProduto(id_produto) {
        return query(
            `SELECT m.*, u.nome_usuario
             FROM Movimentacao m
             LEFT JOIN Usuarios u ON m.id_usuario = u.id_usuario
             WHERE m.id_produto = ?
             ORDER BY m.data_movimentacao DESC`,
            [id_produto]
        );
    }

    static async criar(dados) {
        return create('Movimentacao', dados);
    }
}

export default MovimentacaoModel;

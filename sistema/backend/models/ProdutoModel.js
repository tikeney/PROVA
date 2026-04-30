import { create, update, deleteRecord, query } from '../config/database.js';

class ProdutoModel {
    static async listarTodos(pagina = 1, limite = 10) {
        const offset = (pagina - 1) * limite;
        const produtos = await query(
            'SELECT * FROM Produtos ORDER BY id_produto DESC LIMIT ? OFFSET ?',
            [limite, offset]
        );
        const totais = await query('SELECT COUNT(*) as total FROM Produtos');
        const total = totais[0].total;
        return { produtos, total, pagina, limite, totalPaginas: Math.ceil(total / limite) };
    }

    static async buscarPorId(id) {
        const rows = await query('SELECT * FROM Produtos WHERE id_produto = ?', [id]);
        return rows[0] || null;
    }

    static async buscarEstoqueBaixo() {
        return query('SELECT * FROM Produtos WHERE estoque_atual <= estoque_minimo ORDER BY nome');
    }

    static async criar(dados) {
        return create('Produtos', dados);
    }

    static async atualizar(id, dados) {
        return update('Produtos', dados, `id_produto = ${id}`);
    }

    static async excluir(id) {
        return deleteRecord('Produtos', `id_produto = ${id}`);
    }
}

export default ProdutoModel;

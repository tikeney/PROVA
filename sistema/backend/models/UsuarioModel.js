import { create, update, deleteRecord, comparePassword, hashPassword, query } from '../config/database.js';

class UsuarioModel {
    static async listarTodos(pagina = 1, limite = 10) {
        const offset = (pagina - 1) * limite;
        const usuarios = await query(
            'SELECT id_usuario, nome_usuario, login FROM Usuarios ORDER BY id_usuario DESC LIMIT ? OFFSET ?',
            [limite, offset]
        );
        const totais = await query('SELECT COUNT(*) as total FROM Usuarios');
        const total = totais[0].total;
        return { usuarios, total, pagina, limite, totalPaginas: Math.ceil(total / limite) };
    }

    static async buscarPorId(id) {
        const rows = await query('SELECT id_usuario, nome_usuario, login FROM Usuarios WHERE id_usuario = ?', [id]);
        return rows[0] || null;
    }

    static async buscarPorLogin(login) {
        const rows = await query('SELECT * FROM Usuarios WHERE login = ?', [login]);
        return rows[0] || null;
    }

    static async criar(dados) {
        const senhaHash = await hashPassword(dados.senha);
        return create('Usuarios', { nome_usuario: dados.nome_usuario, login: dados.login, senha: senhaHash });
    }

    static async atualizar(id, dados) {
        if (dados.senha) dados.senha = await hashPassword(dados.senha);
        return update('Usuarios', dados, `id_usuario = ${id}`);
    }

    static async excluir(id) {
        return deleteRecord('Usuarios', `id_usuario = ${id}`);
    }

    static async verificarCredenciais(login, senha) {
        const usuario = await this.buscarPorLogin(login);
        if (!usuario) return null;
        const valida = await comparePassword(senha, usuario.senha);
        if (!valida) return null;
        const { senha: _, ...sem } = usuario;
        return sem;
    }
}

export default UsuarioModel;

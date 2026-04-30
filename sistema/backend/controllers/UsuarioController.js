import UsuarioModel from '../models/UsuarioModel.js';

class UsuarioController {
    // GET /api/usuarios
    static async listarTodos(req, res) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = parseInt(req.query.limite) || 10;
            const resultado = await UsuarioModel.listarTodos(pagina, limite);
            res.json({ sucesso: true, ...resultado });
        } catch (error) {
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar usuários' });
        }
    }

    // GET /api/usuarios/:id
    static async buscarPorId(req, res) {
        try {
            const usuario = await UsuarioModel.buscarPorId(req.params.id);
            if (!usuario) return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
            res.json({ sucesso: true, usuario });
        } catch (error) {
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar usuário' });
        }
    }

    // PUT /api/usuarios/:id
    static async atualizar(req, res) {
        try {
            const usuario = await UsuarioModel.buscarPorId(req.params.id);
            if (!usuario) return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
            const campos = ['nome_usuario', 'login', 'senha'];
            const dados = {};
            campos.forEach(c => { if (req.body[c] !== undefined) dados[c] = req.body[c]; });
            if (Object.keys(dados).length === 0) {
                return res.status(400).json({ sucesso: false, mensagem: 'Nenhum campo para atualizar' });
            }
            await UsuarioModel.atualizar(req.params.id, dados);
            const atualizado = await UsuarioModel.buscarPorId(req.params.id);
            res.json({ sucesso: true, usuario: atualizado });
        } catch (error) {
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar usuário' });
        }
    }

    // DELETE /api/usuarios/:id
    static async excluir(req, res) {
        try {
            const usuario = await UsuarioModel.buscarPorId(req.params.id);
            if (!usuario) return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
            await UsuarioModel.excluir(req.params.id);
            res.json({ sucesso: true, mensagem: 'Usuário excluído com sucesso' });
        } catch (error) {
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir usuário' });
        }
    }
}

export default UsuarioController;

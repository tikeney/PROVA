import ProdutoModel from '../models/ProdutoModel.js';

class ProdutoController {
    // GET /api/produtos
    static async listarTodos(req, res) {
        try {
            const pagina = parseInt(req.query.pagina) || 1;
            const limite = parseInt(req.query.limite) || 10;
            const resultado = await ProdutoModel.listarTodos(pagina, limite);
            res.json({ sucesso: true, ...resultado });
        } catch (error) {
            console.error(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao listar produtos' });
        }
    }

    // GET /api/produtos/estoque-baixo
    static async estoqueBaixo(req, res) {
        try {
            const produtos = await ProdutoModel.buscarEstoqueBaixo();
            res.json({ sucesso: true, produtos });
        } catch (error) {
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar produtos com estoque baixo' });
        }
    }

    // GET /api/produtos/:id
    static async buscarPorId(req, res) {
        try {
            const produto = await ProdutoModel.buscarPorId(req.params.id);
            if (!produto) return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado' });
            res.json({ sucesso: true, produto });
        } catch (error) {
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao buscar produto' });
        }
    }

    // POST /api/produtos
    static async criar(req, res) {
        try {
            const { nome, descricao, unidade_medida, estoque_atual, estoque_minimo, data_validade, caracteristica_variacao } = req.body;
            if (!nome || estoque_minimo === undefined) {
                return res.status(400).json({ sucesso: false, mensagem: 'nome e estoque_minimo são obrigatórios' });
            }
            const dados = {
                nome,
                descricao: descricao || null,
                unidade_medida: unidade_medida || null,
                estoque_atual: estoque_atual || 0,
                estoque_minimo,
                data_validade: data_validade || null,
                caracteristica_variacao: caracteristica_variacao || null
            };
            const id = await ProdutoModel.criar(dados);
            const produto = await ProdutoModel.buscarPorId(id);
            res.status(201).json({ sucesso: true, produto });
        } catch (error) {
            console.error(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao criar produto' });
        }
    }

    // PUT /api/produtos/:id
    static async atualizar(req, res) {
        try {
            const produto = await ProdutoModel.buscarPorId(req.params.id);
            if (!produto) return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado' });
            const campos = ['nome','descricao','unidade_medida','estoque_atual','estoque_minimo','data_validade','caracteristica_variacao'];
            const dados = {};
            campos.forEach(c => { if (req.body[c] !== undefined) dados[c] = req.body[c]; });
            if (Object.keys(dados).length === 0) {
                return res.status(400).json({ sucesso: false, mensagem: 'Nenhum campo para atualizar' });
            }
            await ProdutoModel.atualizar(req.params.id, dados);
            const atualizado = await ProdutoModel.buscarPorId(req.params.id);
            res.json({ sucesso: true, produto: atualizado });
        } catch (error) {
            console.error(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao atualizar produto' });
        }
    }

    // DELETE /api/produtos/:id
    static async excluir(req, res) {
        try {
            const produto = await ProdutoModel.buscarPorId(req.params.id);
            if (!produto) return res.status(404).json({ sucesso: false, mensagem: 'Produto não encontrado' });
            await ProdutoModel.excluir(req.params.id);
            res.json({ sucesso: true, mensagem: 'Produto excluído com sucesso' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro ao excluir produto' });
        }
    }
}

export default ProdutoController;

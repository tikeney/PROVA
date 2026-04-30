import EquipamentoModel from '../models/EquipamentoModel.js';

class EquipamentoController {

    // GET /api/equipamentos - Listar todos os equipamentos
    static async listarTodos(req, res) {
        // TODO: Buscar todos os equipamentos no banco de dados
        // TODO: Retornar a lista com status 200
    }

    // GET /api/equipamentos/:id - Buscar equipamento por ID
    static async buscarPorId(req, res) {
        // TODO: Obter o :id da URL → req.params.id
        // TODO: Buscar o equipamento no banco de dados
        // TODO: Retornar 404 se não encontrado
        // TODO: Retornar o equipamento com status 200 se encontrado
    }

    // POST /api/equipamentos - Cadastrar novo equipamento
    static async criar(req, res) {
        // TODO: Obter os dados do body → req.body
        // TODO: Validar os campos obrigatórios (ex: nome, numero_serie)
        // TODO: Criar o equipamento no banco de dados com status 'disponivel'
        // TODO: Retornar o equipamento criado com status 201
    }

    // PUT /api/equipamentos/:id - Atualizar dados de um equipamento
    static async atualizar(req, res) {
        // TODO: Obter o :id da URL e os dados do body
        // TODO: Verificar se o equipamento existe (retornar 404 se não)
        // TODO: Atualizar os dados no banco de dados
        // TODO: Retornar confirmação com status 200
    }

    // DELETE /api/equipamentos/:id - Remover um equipamento
    static async excluir(req, res) {
        // TODO: Obter o :id da URL
        // TODO: Verificar se o equipamento existe (retornar 404 se não)
        // TODO: Excluir o equipamento do banco de dados
        // TODO: Retornar confirmação com status 200
    }
}

export default EquipamentoController;

import { create, read, update, deleteRecord } from '../config/database.js';

class EquipamentoModel {

    // Buscar todos os equipamentos
    static async listarTodos() {
        // TODO: Implementar a busca de todos os equipamentos
        // Dica: use a função read('equipamentos')
    }

    // Buscar equipamento por ID
    static async buscarPorId(id) {
        // TODO: Implementar a busca por ID
        // Dica: use a função read('equipamentos', `id_equipamento = ${id}`)
        //       e retorne apenas o primeiro resultado (rows[0])
    }

    // Criar novo equipamento
    static async criar(dados) {
        // TODO: Implementar a criação do equipamento
        // Dica: use a função create('equipamentos', dados)
        //       ela retorna o ID do registro inserido
    }

    // Atualizar equipamento
    static async atualizar(id, dados) {
        // TODO: Implementar a atualização do equipamento
        // Dica: use a função update('equipamentos', dados, `id_equipamento = ${id}`)
    }

    // Excluir equipamento
    static async excluir(id) {
        // TODO: Implementar a exclusão do equipamento
        // Dica: use a função deleteRecord('equipamentos', `id_equipamento = ${id}`)
    }
}

export default EquipamentoModel;

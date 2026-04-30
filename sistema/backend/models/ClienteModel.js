import { create, read, update, deleteRecord } from '../config/database.js';

class ClienteModel {

    // Buscar todos os clientes
    static async listarTodos() {
        try {
            const result = await read('Usuarios');
            return result;
        } catch (error) {
            console.error('Erro ao listar clientes:', error);
            throw error;
        }
    }

    // Buscar cliente por ID
    static async buscarPorId(id) {
        try {
            const result = await read('Usuarios', `id_usuario = ${id}`);
            return result[0]; // Retorna o primeiro resultado ou undefined
        } catch (error) {
            console.error(`Erro ao buscar cliente com ID ${id}:`, error);
            throw error;
        }
    }

    // Criar novo cliente
    static async criar(dados) {
        try {
            const result = await create('Usuarios', dados);
            return result; // Retorna o insertId
        } catch (error) {
            console.error('Erro ao criar cliente:', error);
            throw error;
        }
    }

    // Atualizar cliente
    static async atualizar(id, dados) {
        try {
            const result = await update('Usuarios', dados, `id_usuario = ${id}`);
            return result; // Retorna affectedRows
        } catch (error) {
            console.error(`Erro ao atualizar cliente com ID ${id}:`, error);
            throw error;
        }
    }

    // Excluir cliente
    static async excluir(id) {
        try {
            const result = await deleteRecord('Usuarios', `id_usuario = ${id}`);
            return result; // Retorna affectedRows
        } catch (error) {
            console.error(`Erro ao excluir cliente com ID ${id}:`, error);
            throw error;
        }
    }
}

export default ClienteModel;

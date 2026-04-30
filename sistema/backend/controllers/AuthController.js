import jwt from 'jsonwebtoken';
import UsuarioModel from '../models/UsuarioModel.js';
import { JWT_CONFIG } from '../config/jwt.js';

class AuthController {
    // POST /api/auth/login
    static async login(req, res) {
        try {
            const { login, senha } = req.body;
            if (!login || !senha) {
                return res.status(400).json({ sucesso: false, mensagem: 'Login e senha são obrigatórios' });
            }
            const usuario = await UsuarioModel.verificarCredenciais(login, senha);
            if (!usuario) {
                return res.status(401).json({ sucesso: false, mensagem: 'Credenciais inválidas' });
            }
            const token = jwt.sign(
                { id: usuario.id_usuario, login: usuario.login },
                JWT_CONFIG.secret,
                { expiresIn: JWT_CONFIG.expiresIn }
            );
            res.json({ sucesso: true, token, usuario });
        } catch (error) {
            console.error(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
        }
    }

    // POST /api/auth/registro
    static async registro(req, res) {
        try {
            const { nome_usuario, login, senha } = req.body;
            if (!nome_usuario || !login || !senha) {
                return res.status(400).json({ sucesso: false, mensagem: 'nome_usuario, login e senha são obrigatórios' });
            }
            const existente = await UsuarioModel.buscarPorLogin(login);
            if (existente) {
                return res.status(409).json({ sucesso: false, mensagem: 'Login já está em uso' });
            }
            const id = await UsuarioModel.criar({ nome_usuario, login, senha });
            res.status(201).json({ sucesso: true, mensagem: 'Usuário criado com sucesso', id });
        } catch (error) {
            console.error(error);
            res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
        }
    }

    // GET /api/auth/me
    static async me(req, res) {
        try {
            const usuario = await UsuarioModel.buscarPorId(req.usuario.id);
            if (!usuario) return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
            res.json({ sucesso: true, usuario });
        } catch (error) {
            res.status(500).json({ sucesso: false, mensagem: 'Erro interno do servidor' });
        }
    }
}

export default AuthController;

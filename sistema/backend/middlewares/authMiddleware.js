import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt.js';

export function autenticar(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ sucesso: false, mensagem: 'Token não fornecido' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_CONFIG.secret);
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ sucesso: false, mensagem: 'Token inválido ou expirado' });
    }
}

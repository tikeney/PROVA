import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import authRotas from './routes/authRotas.js';
import produtoRotas from './routes/produtoRotas.js';
import movimentacaoRotas from './routes/movimentacaoRotas.js';
import usuarioRotas from './routes/usuarioRotas.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';
import { simpleLogMiddleware } from './middlewares/logMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(simpleLogMiddleware);

app.use('/api/auth', authRotas);
app.use('/api/produtos', produtoRotas);
app.use('/api/movimentacoes', movimentacaoRotas);
app.use('/api/usuarios', usuarioRotas);

app.get('/', (req, res) => {
    res.json({
        sucesso: true,
        mensagem: 'TechRent API - Sistema de Gestão de Estoque',
        versao: '1.0.0',
        rotas: {
            autenticacao: '/api/auth',
            produtos: '/api/produtos',
            movimentacoes: '/api/movimentacoes',
            usuarios: '/api/usuarios',
        }
    });
});

app.use('*', (req, res) => {
    res.status(404).json({ sucesso: false, erro: 'Rota não encontrada' });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});

export default app;

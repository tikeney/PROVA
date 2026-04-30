import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Importar rotas
import authRotas from './routes/authRotas.js';
import clienteRotas from './routes/clienteRotas.js';
import equipamentoRotas from './routes/equipamentoRotas.js';
import emprestimoRotas from './routes/emprestimoRotas.js';

// Importar middlewares
import { simpleLogMiddleware } from './middlewares/logMiddleware.js';
import { errorMiddleware } from './middlewares/errorMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(helmet());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(simpleLogMiddleware);

// Rotas da API
app.use('/api/auth', authRotas);
app.use('/api/clientes', clienteRotas);
app.use('/api/equipamentos', equipamentoRotas);
app.use('/api/emprestimos', emprestimoRotas);

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        sucesso: true,
        mensagem: 'OfficeTech API - Sistema de Gestão de Empréstimos',
        versao: '1.0.0',
        rotas: {
            autenticacao: '/api/auth',
            clientes: '/api/clientes',
            equipamentos: '/api/equipamentos',
            emprestimos: '/api/emprestimos',
        }
    });
});

app.use('*', (req, res) => {
    res.status(404).json({
        sucesso: false,
        erro: 'Rota não encontrada',
        mensagem: `A rota ${req.method} ${req.originalUrl} não foi encontrada`
    });
});

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});

export default app;

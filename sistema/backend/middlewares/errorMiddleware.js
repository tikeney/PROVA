export function errorMiddleware(err, req, res, next) {
    console.error(err.stack);
    const status = err.statusCode || 500;
    res.status(status).json({
        sucesso: false,
        mensagem: err.message || 'Erro interno do servidor',
    });
}

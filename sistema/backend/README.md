# TechRent — Backend API

API RESTful para o sistema de gestão de estoque TechRent.

## Configuração

1. Copie `env.example` para `.env` e preencha as variáveis do banco:

```env
DB_HOST=seu_host
DB_PORT=3306
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=techrent_db
PORT=3000
JWT_SECRET=seu_segredo_jwt
JWT_EXPIRES_IN=8h
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor:
```bash
npm start
```

## Rotas da API

### Autenticação (`/api/auth`)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/login` | Login com `login` e `senha` |
| POST | `/api/auth/registro` | Criar novo usuário |
| GET | `/api/auth/me` | Dados do usuário logado (requer token) |

### Produtos (`/api/produtos`) — requer token
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/produtos` | Listar produtos (paginado) |
| GET | `/api/produtos/estoque-baixo` | Produtos com estoque ≤ mínimo |
| GET | `/api/produtos/:id` | Buscar produto por ID |
| POST | `/api/produtos` | Criar produto |
| PUT | `/api/produtos/:id` | Atualizar produto |
| DELETE | `/api/produtos/:id` | Excluir produto |

### Movimentações (`/api/movimentacoes`) — requer token
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/movimentacoes` | Listar movimentações (paginado) |
| GET | `/api/movimentacoes/:id` | Buscar por ID |
| GET | `/api/movimentacoes/produto/:id` | Histórico de um produto |
| POST | `/api/movimentacoes` | Registrar entrada ou saída |

### Usuários (`/api/usuarios`) — requer token
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/usuarios` | Listar usuários (paginado) |
| GET | `/api/usuarios/:id` | Buscar por ID |
| PUT | `/api/usuarios/:id` | Atualizar usuário |
| DELETE | `/api/usuarios/:id` | Excluir usuário |

## Banco de Dados

O banco utilizado é o `techrent_db` com as tabelas:
- `Usuarios` — id_usuario, nome_usuario, login, senha
- `Produtos` — id_produto, nome, descricao, unidade_medida, estoque_atual, estoque_minimo, data_validade, caracteristica_variacao
- `Movimentacao` — id_movimentacao, tipo_movimentacao (Entrada/Saida), quantidade, data_movimentacao, id_produto, id_usuario

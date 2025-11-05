# Express.js API – Products CRUD

Projeto exemplo que implementa uma API RESTful com Express.js fornecendo operações CRUD para um recurso `products`.

##  Requisitos
- Node.js v18+ recomendado
- npm

##  Como executar
1. Instale as dependências:
   ```
   npm install
   ```
2. Crie um arquivo `.env` baseado em `.env.example` e defina `API_KEY`.
3. Inicie o servidor:
   ```
   npm start
   ```
   Para desenvolvimento com reinício automático (nodemon):
   ```
   npm run dev
   ```
4. A API estará disponível em `http://localhost:3000`.

##  Endpoints
- `GET /` — Rota raiz (Olá Mundo)
- `GET /api/products` — Lista produtos (suporta `category`, `page`, `limit`, `search`)
- `GET /api/products/:id` — Obter produto por ID
- `POST /api/products` — Criar produto (requer `x-api-key` no header)
- `PUT /api/products/:id` — Atualizar produto (requer `x-api-key`)
- `DELETE /api/products/:id` — Excluir produto (requer `x-api-key`)
- `GET /api/products/stats/count` — Estatísticas (contagem por categoria)

##  Autenticação de exemplo
Adicione o cabeçalho:
```
x-api-key: sua_chave_aqui
```

##  Testes
Use Postman, Insomnia ou curl para testar.

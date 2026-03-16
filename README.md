# API Node.js CRUD

API simples em Node.js para atividade, usando `Express` e `SQLite`.

O projeto possui CRUD de:

- clientes
- produtos
- vendedores
- movimentacoes

## Tecnologias

- Node.js
- Express
- SQLite

## Como executar

1. Instale as dependencias:

```bash
npm install
```

2. Inicie o servidor:

```bash
npm start
```

Se a porta `3000` estiver ocupada, use outra porta:

```powershell
$env:PORT=3001
npm start
```

## Rotas principais

### Clientes

- `GET /clientes`
- `GET /clientes/:id`
- `POST /clientes`
- `PUT /clientes/:id`
- `DELETE /clientes/:id`

Exemplo:

```json
{
  "nome": "Maria",
  "email": "maria@email.com",
  "telefone": "65999999999"
}
```

### Produtos

- `GET /produtos`
- `GET /produtos/:id`
- `POST /produtos`
- `PUT /produtos/:id`
- `DELETE /produtos/:id`

Exemplo:

```json
{
  "nome": "Notebook",
  "preco": 3500,
  "quantidade": 8
}
```

### Vendedores

- `GET /vendedores`
- `GET /vendedores/:id`
- `POST /vendedores`
- `PUT /vendedores/:id`
- `DELETE /vendedores/:id`

Exemplo:

```json
{
  "nome": "Joao",
  "email": "joao@email.com",
  "comissao": 5
}
```

### Movimentacoes

- `GET /movimentacoes`
- `GET /movimentacoes/:id`
- `POST /movimentacoes`
- `PUT /movimentacoes/:id`
- `DELETE /movimentacoes/:id`

Exemplo:

```json
{
  "tipo": "venda",
  "quantidade": 2,
  "data": "2026-03-16",
  "cliente_id": 1,
  "produto_id": 1,
  "vendedor_id": 1
}
```

## Estrutura do projeto

```text
api-nodejs/
|-- index.js
|-- package.json
|-- database.sql
|-- src/
    |-- app.js
    |-- database.js
    |-- routes/
        |-- clientes.js
        |-- produtos.js
        |-- vendedores.js
        |-- movimentacoes.js
        |-- criarCrudBasico.js
```

## Observacao

O banco `SQLite` e criado automaticamente ao iniciar a API.

const { all, get, run } = require("../database");

async function validarRelacionamentos(clienteId, produtoId, vendedorId) {
  const cliente = await get("SELECT id FROM clientes WHERE id = ?", [clienteId]);
  const produto = await get("SELECT id FROM produtos WHERE id = ?", [produtoId]);
  const vendedor = await get("SELECT id FROM vendedores WHERE id = ?", [vendedorId]);

  if (!cliente) {
    return "Cliente nao encontrado";
  }

  if (!produto) {
    return "Produto nao encontrado";
  }

  if (!vendedor) {
    return "Vendedor nao encontrado";
  }

  return null;
}

async function listar() {
  return all(`
    SELECT
      movimentacoes.id,
      movimentacoes.tipo,
      movimentacoes.quantidade,
      movimentacoes.data,
      movimentacoes.cliente_id,
      clientes.nome AS cliente,
      movimentacoes.produto_id,
      produtos.nome AS produto,
      movimentacoes.vendedor_id,
      vendedores.nome AS vendedor
    FROM movimentacoes
    INNER JOIN clientes ON clientes.id = movimentacoes.cliente_id
    INNER JOIN produtos ON produtos.id = movimentacoes.produto_id
    INNER JOIN vendedores ON vendedores.id = movimentacoes.vendedor_id
    ORDER BY movimentacoes.id
  `);
}

async function buscarPorId(id) {
  return get(`
    SELECT
      movimentacoes.id,
      movimentacoes.tipo,
      movimentacoes.quantidade,
      movimentacoes.data,
      movimentacoes.cliente_id,
      clientes.nome AS cliente,
      movimentacoes.produto_id,
      produtos.nome AS produto,
      movimentacoes.vendedor_id,
      vendedores.nome AS vendedor
    FROM movimentacoes
    INNER JOIN clientes ON clientes.id = movimentacoes.cliente_id
    INNER JOIN produtos ON produtos.id = movimentacoes.produto_id
    INNER JOIN vendedores ON vendedores.id = movimentacoes.vendedor_id
    WHERE movimentacoes.id = ?
  `, [id]);
}

async function criar(dados) {
  const { tipo, quantidade, data, cliente_id, produto_id, vendedor_id } = dados;
  const erroRelacionamento = await validarRelacionamentos(cliente_id, produto_id, vendedor_id);

  if (erroRelacionamento) {
    return { erroRelacionamento };
  }

  const resultado = await run(
    `
      INSERT INTO movimentacoes
      (tipo, quantidade, data, cliente_id, produto_id, vendedor_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [tipo, quantidade, data, cliente_id, produto_id, vendedor_id]
  );

  return {
    registro: {
      id: resultado.lastID,
      tipo,
      quantidade,
      data,
      cliente_id,
      produto_id,
      vendedor_id
    }
  };
}

async function atualizar(id, dados) {
  const { tipo, quantidade, data, cliente_id, produto_id, vendedor_id } = dados;
  const erroRelacionamento = await validarRelacionamentos(cliente_id, produto_id, vendedor_id);

  if (erroRelacionamento) {
    return { erroRelacionamento };
  }

  const resultado = await run(
    `
      UPDATE movimentacoes
      SET tipo = ?, quantidade = ?, data = ?, cliente_id = ?, produto_id = ?, vendedor_id = ?
      WHERE id = ?
    `,
    [tipo, quantidade, data, cliente_id, produto_id, vendedor_id, id]
  );

  return {
    changes: resultado.changes,
    registro: {
      id: Number(id),
      tipo,
      quantidade,
      data,
      cliente_id,
      produto_id,
      vendedor_id
    }
  };
}

async function remover(id) {
  return run("DELETE FROM movimentacoes WHERE id = ?", [id]);
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover
};

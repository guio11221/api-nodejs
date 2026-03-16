const express = require("express");
const { all, get, run } = require("../database");

const router = express.Router();

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

router.get("/", async (req, res) => {
  try {
    const registros = await all(`
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

    res.json(registros);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar movimentacoes" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const registro = await get(`
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
    `, [req.params.id]);

    if (!registro) {
      return res.status(404).json({ erro: "Movimentacao nao encontrada" });
    }

    res.json(registro);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar movimentacao" });
  }
});

router.post("/", async (req, res) => {
  const { tipo, quantidade, data, cliente_id, produto_id, vendedor_id } = req.body;

  if (!tipo || quantidade === undefined || !data || !cliente_id || !produto_id || !vendedor_id) {
    return res.status(400).json({
      erro: "Informe tipo, quantidade, data, cliente_id, produto_id e vendedor_id"
    });
  }

  try {
    const erroRelacionamento = await validarRelacionamentos(cliente_id, produto_id, vendedor_id);

    if (erroRelacionamento) {
      return res.status(404).json({ erro: erroRelacionamento });
    }

    const resultado = await run(
      `
        INSERT INTO movimentacoes
        (tipo, quantidade, data, cliente_id, produto_id, vendedor_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [tipo, quantidade, data, cliente_id, produto_id, vendedor_id]
    );

    res.status(201).json({
      id: resultado.lastID,
      tipo,
      quantidade,
      data,
      cliente_id,
      produto_id,
      vendedor_id
    });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao cadastrar movimentacao" });
  }
});

router.put("/:id", async (req, res) => {
  const { tipo, quantidade, data, cliente_id, produto_id, vendedor_id } = req.body;

  if (!tipo || quantidade === undefined || !data || !cliente_id || !produto_id || !vendedor_id) {
    return res.status(400).json({
      erro: "Informe tipo, quantidade, data, cliente_id, produto_id e vendedor_id"
    });
  }

  try {
    const erroRelacionamento = await validarRelacionamentos(cliente_id, produto_id, vendedor_id);

    if (erroRelacionamento) {
      return res.status(404).json({ erro: erroRelacionamento });
    }

    const resultado = await run(
      `
        UPDATE movimentacoes
        SET tipo = ?, quantidade = ?, data = ?, cliente_id = ?, produto_id = ?, vendedor_id = ?
        WHERE id = ?
      `,
      [tipo, quantidade, data, cliente_id, produto_id, vendedor_id, req.params.id]
    );

    if (resultado.changes === 0) {
      return res.status(404).json({ erro: "Movimentacao nao encontrada" });
    }

    res.json({
      id: Number(req.params.id),
      tipo,
      quantidade,
      data,
      cliente_id,
      produto_id,
      vendedor_id
    });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao atualizar movimentacao" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const resultado = await run("DELETE FROM movimentacoes WHERE id = ?", [req.params.id]);

    if (resultado.changes === 0) {
      return res.status(404).json({ erro: "Movimentacao nao encontrada" });
    }

    res.json({ mensagem: "Movimentacao deletada com sucesso" });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao deletar movimentacao" });
  }
});

module.exports = router;

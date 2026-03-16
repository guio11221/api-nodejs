const express = require("express");
const db = require("../database");

const router = express.Router();

router.get("/", (req, res) => {
  db.all("SELECT * FROM produtos ORDER BY id", [], (erro, rows) => {
    if (erro) {
      return res.status(500).json({ erro: "Erro ao buscar produtos" });
    }

    res.json(rows);
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.get("SELECT * FROM produtos WHERE id = ?", [id], (erro, row) => {
    if (erro) {
      return res.status(500).json({ erro: "Erro ao buscar produto" });
    }

    if (!row) {
      return res.status(404).json({ erro: "Produto nao encontrado" });
    }

    res.json(row);
  });
});

router.post("/", (req, res) => {
  const { nome, preco, quantidade } = req.body;

  if (!nome || preco === undefined || quantidade === undefined) {
    return res.status(400).json({
      erro: "Informe nome, preco e quantidade"
    });
  }

  const sql = "INSERT INTO produtos (nome, preco, quantidade) VALUES (?, ?, ?)";

  db.run(sql, [nome, preco, quantidade], function (erro) {
    if (erro) {
      return res.status(500).json({ erro: "Erro ao cadastrar produto" });
    }

    res.status(201).json({
      id: this.lastID,
      nome,
      preco,
      quantidade
    });
  });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nome, preco, quantidade } = req.body;

  if (!nome || preco === undefined || quantidade === undefined) {
    return res.status(400).json({
      erro: "Informe nome, preco e quantidade"
    });
  }

  const sql = `
    UPDATE produtos
    SET nome = ?, preco = ?, quantidade = ?
    WHERE id = ?
  `;

  db.run(sql, [nome, preco, quantidade, id], function (erro) {
    if (erro) {
      return res.status(500).json({ erro: "Erro ao atualizar produto" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ erro: "Produto nao encontrado" });
    }

    res.json({
      id: Number(id),
      nome,
      preco,
      quantidade
    });
  });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM produtos WHERE id = ?", [id], function (erro) {
    if (erro) {
      return res.status(500).json({ erro: "Erro ao deletar produto" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ erro: "Produto nao encontrado" });
    }

    res.json({ mensagem: "Produto deletado com sucesso" });
  });
});

module.exports = router;

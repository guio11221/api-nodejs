const express = require("express");
const { all, get, run } = require("../database");

function criarCrudBasico(config) {
  const router = express.Router();
  const { tabela, nomeEntidade, camposObrigatorios, camposPermitidos } = config;

  router.get("/", async (req, res) => {
    try {
      const registros = await all(`SELECT * FROM ${tabela} ORDER BY id`);
      res.json(registros);
    } catch (erro) {
      res.status(500).json({ erro: `Erro ao buscar ${nomeEntidade}` });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const registro = await get(`SELECT * FROM ${tabela} WHERE id = ?`, [req.params.id]);

      if (!registro) {
        return res.status(404).json({ erro: `${nomeEntidade} nao encontrado` });
      }

      res.json(registro);
    } catch (erro) {
      res.status(500).json({ erro: `Erro ao buscar ${nomeEntidade}` });
    }
  });

  router.post("/", async (req, res) => {
    const faltando = camposObrigatorios.filter((campo) => req.body[campo] === undefined || req.body[campo] === "");

    if (faltando.length > 0) {
      return res.status(400).json({
        erro: `Informe: ${faltando.join(", ")}`
      });
    }

    const valores = camposPermitidos.map((campo) => req.body[campo] ?? null);
    const colunas = camposPermitidos.join(", ");
    const placeholders = camposPermitidos.map(() => "?").join(", ");

    try {
      const resultado = await run(
        `INSERT INTO ${tabela} (${colunas}) VALUES (${placeholders})`,
        valores
      );

      res.status(201).json({
        id: resultado.lastID,
        ...camposPermitidos.reduce((acc, campo) => {
          acc[campo] = req.body[campo] ?? null;
          return acc;
        }, {})
      });
    } catch (erro) {
      res.status(500).json({ erro: `Erro ao cadastrar ${nomeEntidade}` });
    }
  });

  router.put("/:id", async (req, res) => {
    const faltando = camposObrigatorios.filter((campo) => req.body[campo] === undefined || req.body[campo] === "");

    if (faltando.length > 0) {
      return res.status(400).json({
        erro: `Informe: ${faltando.join(", ")}`
      });
    }

    const setClause = camposPermitidos.map((campo) => `${campo} = ?`).join(", ");
    const valores = camposPermitidos.map((campo) => req.body[campo] ?? null);

    try {
      const resultado = await run(
        `UPDATE ${tabela} SET ${setClause} WHERE id = ?`,
        [...valores, req.params.id]
      );

      if (resultado.changes === 0) {
        return res.status(404).json({ erro: `${nomeEntidade} nao encontrado` });
      }

      res.json({
        id: Number(req.params.id),
        ...camposPermitidos.reduce((acc, campo) => {
          acc[campo] = req.body[campo] ?? null;
          return acc;
        }, {})
      });
    } catch (erro) {
      res.status(500).json({ erro: `Erro ao atualizar ${nomeEntidade}` });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      const resultado = await run(`DELETE FROM ${tabela} WHERE id = ?`, [req.params.id]);

      if (resultado.changes === 0) {
        return res.status(404).json({ erro: `${nomeEntidade} nao encontrado` });
      }

      res.json({ mensagem: `${nomeEntidade} deletado com sucesso` });
    } catch (erro) {
      res.status(500).json({ erro: `Erro ao deletar ${nomeEntidade}` });
    }
  });

  return router;
}

module.exports = criarCrudBasico;

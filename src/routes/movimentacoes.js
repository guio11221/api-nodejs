const express = require("express");
const movimentacoesService = require("../services/movimentacoesService");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const registros = await movimentacoesService.listar();
    res.json(registros);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao buscar movimentacoes" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const registro = await movimentacoesService.buscarPorId(req.params.id);

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
    const resultado = await movimentacoesService.criar(req.body);

    if (resultado.erroRelacionamento) {
      return res.status(404).json({ erro: resultado.erroRelacionamento });
    }

    res.status(201).json(resultado.registro);
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
    const resultado = await movimentacoesService.atualizar(req.params.id, req.body);

    if (resultado.erroRelacionamento) {
      return res.status(404).json({ erro: resultado.erroRelacionamento });
    }

    if (resultado.changes === 0) {
      return res.status(404).json({ erro: "Movimentacao nao encontrada" });
    }

    res.json(resultado.registro);
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao atualizar movimentacao" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const resultado = await movimentacoesService.remover(req.params.id);

    if (resultado.changes === 0) {
      return res.status(404).json({ erro: "Movimentacao nao encontrada" });
    }

    res.json({ mensagem: "Movimentacao deletada com sucesso" });
  } catch (erro) {
    res.status(500).json({ erro: "Erro ao deletar movimentacao" });
  }
});

module.exports = router;

const express = require("express");

function criarCrudBasico(config) {
  const router = express.Router();
  const {
    nomeEntidade,
    camposObrigatorios,
    service,
    validarCriacao,
    validarAtualizacao
  } = config;

  function obterCamposInformados(body) {
    return Object.keys(body).filter((campo) => body[campo] !== undefined);
  }

  function validarCamposObrigatorios(body) {
    return camposObrigatorios.filter((campo) => body[campo] === undefined || body[campo] === "");
  }

  async function atualizarRegistro(req, res) {
    const camposInformados = obterCamposInformados(req.body);

    if (camposInformados.length === 0) {
      return res.status(400).json({ erro: "Informe ao menos um campo para atualizar" });
    }

    const faltando = camposInformados
      .filter((campo) => camposObrigatorios.includes(campo))
      .filter((campo) => req.body[campo] === "");

    if (faltando.length > 0) {
      return res.status(400).json({
        erro: `Informe: ${faltando.join(", ")}`
      });
    }

    if (validarAtualizacao) {
      const erroValidacao = await validarAtualizacao(req.body);

      if (erroValidacao) {
        return res.status(400).json({ erro: erroValidacao });
      }
    }

    try {
      const resultado = await service.atualizar(req.params.id, req.body);

      if (resultado.changes === 0) {
        return res.status(404).json({ erro: `${nomeEntidade} nao encontrado` });
      }

      res.json(resultado.registro);
    } catch (erro) {
      res.status(500).json({ erro: `Erro ao atualizar ${nomeEntidade}` });
    }
  }

  router.get("/", async (req, res) => {
    try {
      const registros = await service.listar();
      res.json(registros);
    } catch (erro) {
      res.status(500).json({ erro: `Erro ao buscar ${nomeEntidade}` });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const registro = await service.buscarPorId(req.params.id);

      if (!registro) {
        return res.status(404).json({ erro: `${nomeEntidade} nao encontrado` });
      }

      res.json(registro);
    } catch (erro) {
      res.status(500).json({ erro: `Erro ao buscar ${nomeEntidade}` });
    }
  });

  router.post("/", async (req, res) => {
    const faltando = validarCamposObrigatorios(req.body);

    if (faltando.length > 0) {
      return res.status(400).json({
        erro: `Informe: ${faltando.join(", ")}`
      });
    }

    if (validarCriacao) {
      const erroValidacao = await validarCriacao(req.body);

      if (erroValidacao) {
        return res.status(400).json({ erro: erroValidacao });
      }
    }

    try {
      const registro = await service.criar(req.body);
      res.status(201).json(registro);
    } catch (erro) {
      res.status(500).json({ erro: `Erro ao cadastrar ${nomeEntidade}` });
    }
  });

  router.put("/:id", async (req, res) => {
    return atualizarRegistro(req, res);
  });

  router.patch("/:id", atualizarRegistro);

  router.delete("/:id", async (req, res) => {
    try {
      const resultado = await service.remover(req.params.id);

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

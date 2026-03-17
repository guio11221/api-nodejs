const { all, get, run } = require("../database");

function criarCrudBasicoService(config) {
  const { tabela, camposPermitidos } = config;

  function montarPayload(dados) {
    return camposPermitidos.reduce((acc, campo) => {
      acc[campo] = dados[campo] ?? null;
      return acc;
    }, {});
  }

  async function listar() {
    return all(`SELECT * FROM ${tabela} ORDER BY id`);
  }

  async function buscarPorId(id) {
    return get(`SELECT * FROM ${tabela} WHERE id = ?`, [id]);
  }

  async function criar(dados) {
    const valores = camposPermitidos.map((campo) => dados[campo] ?? null);
    const colunas = camposPermitidos.join(", ");
    const placeholders = camposPermitidos.map(() => "?").join(", ");
    const resultado = await run(
      `INSERT INTO ${tabela} (${colunas}) VALUES (${placeholders})`,
      valores
    );

    return {
      id: resultado.lastID,
      ...montarPayload(dados)
    };
  }

  async function atualizar(id, dados) {
    const setClause = camposPermitidos.map((campo) => `${campo} = ?`).join(", ");
    const valores = camposPermitidos.map((campo) => dados[campo] ?? null);
    const resultado = await run(
      `UPDATE ${tabela} SET ${setClause} WHERE id = ?`,
      [...valores, id]
    );

    return {
      changes: resultado.changes,
      registro: {
        id: Number(id),
        ...montarPayload(dados)
      }
    };
  }

  async function remover(id) {
    return run(`DELETE FROM ${tabela} WHERE id = ?`, [id]);
  }

  return {
    listar,
    buscarPorId,
    criar,
    atualizar,
    remover
  };
}

module.exports = criarCrudBasicoService;

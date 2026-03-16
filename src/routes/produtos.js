const criarCrudBasico = require("./criarCrudBasico");

module.exports = criarCrudBasico({
  tabela: "produtos",
  nomeEntidade: "produto",
  camposObrigatorios: ["nome", "preco", "quantidade"],
  camposPermitidos: ["nome", "preco", "quantidade"]
});

const criarCrudBasicoService = require("./criarCrudBasicoService");

module.exports = criarCrudBasicoService({
  tabela: "clientes",
  camposPermitidos: ["nome", "email", "telefone"]
});

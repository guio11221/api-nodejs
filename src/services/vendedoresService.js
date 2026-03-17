const criarCrudBasicoService = require("./criarCrudBasicoService");

module.exports = criarCrudBasicoService({
  tabela: "vendedores",
  camposPermitidos: ["nome", "email", "comissao"]
});

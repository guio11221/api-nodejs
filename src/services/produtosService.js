const criarCrudBasicoService = require("./criarCrudBasicoService");

module.exports = criarCrudBasicoService({
  tabela: "produtos",
  camposPermitidos: ["nome", "preco", "quantidade"]
});

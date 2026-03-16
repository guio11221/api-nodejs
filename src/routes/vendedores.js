const criarCrudBasico = require("./criarCrudBasico");

module.exports = criarCrudBasico({
  tabela: "vendedores",
  nomeEntidade: "vendedor",
  camposObrigatorios: ["nome"],
  camposPermitidos: ["nome", "email", "comissao"]
});

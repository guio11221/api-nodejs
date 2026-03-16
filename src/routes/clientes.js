const criarCrudBasico = require("./criarCrudBasico");

module.exports = criarCrudBasico({
  tabela: "clientes",
  nomeEntidade: "cliente",
  camposObrigatorios: ["nome"],
  camposPermitidos: ["nome", "email", "telefone"]
});

const criarCrudBasico = require("./criarCrudBasico");
const produtosService = require("../services/produtosService");

module.exports = criarCrudBasico({
  nomeEntidade: "produto",
  camposObrigatorios: ["nome", "preco", "quantidade"],
  service: produtosService
});

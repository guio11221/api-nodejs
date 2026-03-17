const criarCrudBasico = require("./criarCrudBasico");
const vendedoresService = require("../services/vendedoresService");

module.exports = criarCrudBasico({
  nomeEntidade: "vendedor",
  camposObrigatorios: ["nome"],
  service: vendedoresService
});

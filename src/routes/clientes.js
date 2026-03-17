const criarCrudBasico = require("./criarCrudBasico");
const clientesService = require("../services/clientesService");

module.exports = criarCrudBasico({
  nomeEntidade: "cliente",
  camposObrigatorios: ["nome"],
  service: clientesService
});

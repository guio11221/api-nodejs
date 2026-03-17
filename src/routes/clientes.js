const criarCrudBasico = require("./criarCrudBasico");
const clientesService = require("../services/clientesService");

function validarNome(body) {
  if (body.nome !== undefined && body.nome === "") {
    return "Informe: nome";
  }

  return null;
}

module.exports = criarCrudBasico({
  nomeEntidade: "cliente",
  camposObrigatorios: ["nome"],
  service: clientesService,
  validarCriacao: validarNome,
  validarAtualizacao: validarNome
});

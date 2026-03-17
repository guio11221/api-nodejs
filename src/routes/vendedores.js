const criarCrudBasico = require("./criarCrudBasico");
const vendedoresService = require("../services/vendedoresService");

function ehNumeroValido(valor) {
  return typeof valor === "number" && Number.isFinite(valor);
}

function validarVendedor(body) {
  if (body.nome !== undefined && body.nome === "") {
    return "Informe: nome";
  }

  if (body.comissao !== undefined && !ehNumeroValido(body.comissao)) {
    return "comissao deve ser numerica";
  }

  return null;
}

module.exports = criarCrudBasico({
  nomeEntidade: "vendedor",
  camposObrigatorios: ["nome"],
  service: vendedoresService,
  validarCriacao: validarVendedor,
  validarAtualizacao: validarVendedor
});

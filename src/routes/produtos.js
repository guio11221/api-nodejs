const criarCrudBasico = require("./criarCrudBasico");
const produtosService = require("../services/produtosService");

function ehNumeroValido(valor) {
  return typeof valor === "number" && Number.isFinite(valor);
}

function validarProduto(body) {
  if (body.nome !== undefined && body.nome === "") {
    return "Informe: nome";
  }

  if (body.preco !== undefined && !ehNumeroValido(body.preco)) {
    return "preco deve ser numerico";
  }

  if (body.quantidade !== undefined && (!Number.isInteger(body.quantidade) || body.quantidade < 0)) {
    return "quantidade deve ser um inteiro maior ou igual a zero";
  }

  return null;
}

module.exports = criarCrudBasico({
  nomeEntidade: "produto",
  camposObrigatorios: ["nome", "preco", "quantidade"],
  service: produtosService,
  validarCriacao: validarProduto,
  validarAtualizacao: validarProduto
});

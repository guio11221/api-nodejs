const express = require("express");
const produtosRouter = require("./routes/produtos");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "API CRUD de produtos funcionando",
    rotas: {
      listar: "GET /produtos",
      buscarPorId: "GET /produtos/:id",
      criar: "POST /produtos",
      atualizar: "PUT /produtos/:id",
      deletar: "DELETE /produtos/:id"
    }
  });
});

app.use("/produtos", produtosRouter);

module.exports = app;

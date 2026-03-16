const express = require("express");
const clientesRouter = require("./routes/clientes");
const movimentacoesRouter = require("./routes/movimentacoes");
const produtosRouter = require("./routes/produtos");
const vendedoresRouter = require("./routes/vendedores");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    mensagem: "API CRUD funcionando",
    rotas: {
      clientes: "/clientes",
      produtos: "/produtos",
      vendedores: "/vendedores",
      movimentacoes: "/movimentacoes"
    }
  });
});

app.use("/clientes", clientesRouter);
app.use("/produtos", produtosRouter);
app.use("/vendedores", vendedoresRouter);
app.use("/movimentacoes", movimentacoesRouter);

module.exports = app;

const app = require("./src/app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});


// Não é possível editar um cliente sem mudar seu nome. e se quisermos atualizar por exemplo
// seu número ou telefone

//Não é possível dar PUT num produto sem modificar seu nome/preco. E se so quisermos atualiar a quantidade?
//Qual a solução nesse caso?

//"comissao" de vendedores é um campo que pode receber string, o que pode tornar difícil realizar cálculos


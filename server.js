import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import productRoutes from "./routes/products.js";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(bodyParser.json());

// Middleware de logging personalizado
app.use(logger);

// Rota raiz
app.get("/", (req, res) => {
  res.send(" Olá Mundo! API Express.js funcionando!");
});

// Rotas de produtos
app.use("/api/products", productRoutes);

// Middleware global de tratamento de erros
app.use(errorHandler);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


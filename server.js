////1.server

import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import productRoutes from "./routes/products.js";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(logger);

// Rotas
app.get("/", (req, res) => {
  res.send(" Olá Mundo! API Express.js funcionando!");
});
app.use("/api/products", productRoutes);

// Middleware global de erros
app.use(errorHandler);

// Servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));



////2.routes/products.js
import express from "express";
import { v4 as uuidv4 } from "uuid";
import { products } from "../data/products.js";
import auth from "../middleware/auth.js";
import { ValidationError, NotFoundError } from "../utils/errors.js";

const router = express.Router();

// GET - listar todos (com filtro e paginação)
router.get("/", (req, res) => {
  const { category, page = 1, limit = 5, search } = req.query;
  let filtered = products;

  if (category) {
    filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + parseInt(limit));

  res.json({
    total: filtered.length,
    page: parseInt(page),
    limit: parseInt(limit),
    data: paginated,
  });
});

// GET - por ID
router.get("/:id", (req, res, next) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return next(new NotFoundError("Produto não encontrado"));
  res.json(product);
});

// POST - criar
router.post("/", auth, (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;
  if (!name || !price || !category)
    return next(new ValidationError("Campos obrigatórios: name, price, category"));

  const newProduct = {
    id: uuidv4(),
    name,
    description,
    price,
    category,
    inStock: inStock ?? true,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT - atualizar
router.put("/:id", auth, (req, res, next) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError("Produto não encontrado"));

  const updated = { ...products[index], ...req.body };
  products[index] = updated;

  res.json(updated);
});

// DELETE - excluir
router.delete("/:id", auth, (req, res, next) => {
  const index = products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return next(new NotFoundError("Produto não encontrado"));

  products.splice(index, 1);
  res.json({ message: "Produto excluído com sucesso" });
});

// Estatísticas
router.get("/stats/count", (req, res) => {
  const stats = {};
  products.forEach((p) => {
    stats[p.category] = (stats[p.category] || 0) + 1;
  });
  res.json(stats);
});

export default router;



////3.middleware/logger.js
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

export default logger;



////4.middleware/auth.js
const auth = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ message: "Acesso negado. Chave de API inválida." });
  }
  next();
};

export default auth;



////5.middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.name || "Error",
    message: err.message || "Erro interno do servidor",
  });
};

export default errorHandler;



////6.utils/errors.js
export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
  }
}



////7.data/products.js
export const products = [
  {
    id: "1",
    name: "Camiseta",
    description: "Camiseta 100% algodão",
    price: 20,
    category: "Roupas",
    inStock: true,
  },
  {
    id: "2",
    name: "Notebook",
    description: "Notebook Dell Inspiron",
    price: 1200,
    category: "Eletrônicos",
    inStock: true,
  },
];



////8..env.example
PORT=3000
API_KEY=minha_chave_segura

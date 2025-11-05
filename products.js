import express from "express";
import { v4 as uuidv4 } from "uuid";
import { products } from "../data/products.js";
import auth from "../middleware/auth.js";
import { ValidationError, NotFoundError } from "../utils/errors.js";

const router = express.Router();

// GET / - listar todos (suporta filtro por category, paginação e busca)
router.get("/", (req, res) => {
  const { category, page = 1, limit = 5, search } = req.query;
  let filtered = products.slice();

  if (category) {
    filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
  }

  const pageNum = parseInt(page, 10) || 1;
  const lim = parseInt(limit, 10) || 5;
  const start = (pageNum - 1) * lim;
  const paginated = filtered.slice(start, start + lim);

  res.json({
    total: filtered.length,
    page: pageNum,
    limit: lim,
    data: paginated,
  });
});

// GET /:id - obter por id
router.get("/:id", (req, res, next) => {
  const product = products.find((p) => p.id === req.params.id);
  if (!product) return next(new NotFoundError("Produto não encontrado"));
  res.json(product);
});

// POST / - criar novo (requer auth)
router.post("/", auth, (req, res, next) => {
  try {
    const { name, description = "", price, category, inStock = true } = req.body;
    if (!name || price === undefined || !category) {
      throw new ValidationError("Campos obrigatórios: name, price, category");
    }

    const newProduct = {
      id: uuidv4(),
      name,
      description,
      price,
      category,
      inStock,
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

// PUT /:id - atualizar (requer auth)
router.put("/:id", auth, (req, res, next) => {
  try {
    const index = products.findIndex((p) => p.id === req.params.id);
    if (index === -1) return next(new NotFoundError("Produto não encontrado"));

    const updated = { ...products[index], ...req.body };
    products[index] = updated;

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /:id - excluir (requer auth)
router.delete("/:id", auth, (req, res, next) => {
  try {
    const index = products.findIndex((p) => p.id === req.params.id);
    if (index === -1) return next(new NotFoundError("Produto não encontrado"));

    products.splice(index, 1);
    res.json({ message: "Produto excluído com sucesso" });
  } catch (err) {
    next(err);
  }
});

// GET /stats/count - estatísticas por categoria
router.get("/stats/count", (req, res) => {
  const stats = {};
  products.forEach((p) => {
    stats[p.category] = (stats[p.category] || 0) + 1;
  });
  res.json(stats);
});

export default router;

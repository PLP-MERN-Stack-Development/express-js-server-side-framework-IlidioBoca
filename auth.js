import dotenv from "dotenv";
dotenv.config();

const auth = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ message: "Acesso negado. Chave de API inválida." });
  }
  next();
};

export default auth;

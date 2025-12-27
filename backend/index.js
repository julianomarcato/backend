const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.get("/", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json({
    message: "API + Postgres rodando no Docker 🚀",
    dbTime: result.rows[0].now,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor ativo na porta ${PORT}`);
});

import express from "express";
import routes from "./routes";

const app = express();

app.use(express.json());

// 🔹 Todas as rotas passam pelo agregador
app.use(routes);

export default app;

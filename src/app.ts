import express from "express";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import healthRoutes from "./routes/health.routes";

const app = express();

app.use(express.json());

app.use("/health", healthRoutes);
app.use("/auth", authRoutes);
app.use("/users", userRoutes);

export default app;

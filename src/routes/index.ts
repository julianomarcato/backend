import { Router } from "express";

import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import healthRoutes from "./health.routes";
import protectedRoutes from "./protected.routes";

const router = Router();

// 🔓 Públicas
router.use("/health", healthRoutes);
router.use("/auth", authRoutes);

// 🔐 Protegidas
router.use("/users", userRoutes);
router.use("/protected", protectedRoutes);

export default router;

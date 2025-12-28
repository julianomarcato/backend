import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authMiddleware, (req, res) => {
  res.json({
    message: "Acesso autorizado",
    user: (req as any).user
  });
});

export default router;
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const router = Router();

router.get("/me", authMiddleware, (req, res) => {
  return res.json({
    id: req.user!.id,
    email: req.user!.email,
    role: req.user!.role,
  });
});

router.get(
  "/admin",
  authMiddleware,
  requireRole(["ADMIN"]),
  (req, res) => {
    res.json({ message: "Área administrativa" });
  }
);

export default router;

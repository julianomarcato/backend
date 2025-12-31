import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";

const router = Router();

router.post("/login", AuthController.login);

router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: "Refresh token não informado" });
    }

    const token = await AuthService.refresh(refreshToken);
    return res.json(token);
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});

export default router;

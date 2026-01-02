import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  // =========================
  // LOGIN
  // =========================
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      const { accessToken, refreshToken } =
        await AuthService.login(email, password);

      return res.json({
        accessToken,
        refreshToken,
      });
    } catch (err: any) {
      return res.status(401).json({
        error: err.message || "Invalid credentials",
      });
    }
  }

  // =========================
  // REFRESH TOKEN
  // =========================
  static async refresh(req: Request, res: Response) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: "Refresh token is required",
      });
    }

    try {
      const tokens = await AuthService.refresh(refreshToken);

      return res.json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } catch (err: any) {
      return res.status(401).json({
        error: err.message || "Invalid refresh token",
      });
    }
  }
}

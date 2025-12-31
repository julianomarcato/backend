import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
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
}

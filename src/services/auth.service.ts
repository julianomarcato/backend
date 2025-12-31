import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

export class AuthService {
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");

    // ✅ valida senha corretamente
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new Error("Invalid credentials");

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role, // já aproveita para RBAC
      },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  static async refresh(token: string) {
    const stored = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new Error("Invalid refresh token");
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET!
    ) as { id: number };

    const newAccessToken = jwt.sign(
      { id: payload.id },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    return { accessToken: newAccessToken };
  }
}

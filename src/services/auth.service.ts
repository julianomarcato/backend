import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../prisma/client";

interface JwtPayload {
  id: number;
  email?: string;
  role?: string;
}

export class AuthService {
  // =========================
  // LOGIN
  // =========================
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
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

    return {
      accessToken,
      refreshToken,
    };
  }

  // =========================
  // REFRESH TOKEN ROTATION
  // =========================
  static async refresh(oldToken: string) {
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: oldToken },
    include: { user: true },
  });

  if (!storedToken) {
    throw new Error("Invalid refresh token");
  }

  if (storedToken.revokedAt) {
    throw new Error("Refresh token revoked");
  }

  if (storedToken.expiresAt < new Date()) {
    throw new Error("Refresh token expired");
  }

  // Revoga o token antigo
  await prisma.refreshToken.update({
    where: { id: storedToken.id },
    data: { revokedAt: new Date() },
  });

  // Gera novos tokens
  const accessToken = jwt.sign(
    {
      id: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  const newRefreshToken = jwt.sign(
    { id: storedToken.user.id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );

  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: storedToken.user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
}
}

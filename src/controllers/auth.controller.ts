import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../lib/prisma";

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token ausente" });
  }

  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  // 🔥 Replay detectado
  if (!stored || stored.revokedAt) {
    if (stored?.userId) {
      await prisma.refreshToken.updateMany({
        where: {
          userId: stored.userId,
          revokedAt: null,
        },
        data: { revokedAt: new Date() },
      });
    }

    return res.status(403).json({
      error: "Refresh token inválido ou reutilizado",
    });
  }

  // ⏰ Expirado
  if (stored.expiresAt < new Date()) {
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    return res.status(403).json({ error: "Refresh token expirado" });
  }

  // 🔄 Revoga o atual
  const newRefreshToken = crypto.randomUUID();

  await prisma.refreshToken.update({
    where: { id: stored.id },
    data: {
      revokedAt: new Date(),
      replacedBy: newRefreshToken,
    },
  });

  // 💾 Cria o novo
  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: stored.userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  // 🔐 Novo access token
  const accessToken = jwt.sign(
    {
      id: stored.user.id,
      email: stored.user.email,
      role: stored.user.role,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );

  return res.json({
    accessToken,
    refreshToken: newRefreshToken,
  });
}

import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";

export class AuthService {
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    // Se ainda não tem senha no model, usamos exemplo simples
    // Ideal: adicionar campo password no Prisma
    const passwordValid = password === "123456";

    if (!passwordValid) {
      throw new Error("Credenciais inválidas");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}

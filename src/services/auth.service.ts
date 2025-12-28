import { prisma } from "../lib/prisma"; // seu client do Prisma
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Usuário ou senha inválidos");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Usuário ou senha inválidos");

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "changeme",
      { expiresIn: "1h" }
    );

    return token;
  }
}

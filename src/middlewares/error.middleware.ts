import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export function errorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Zod
  if (err instanceof ZodError) {
    return res.status(400).json({
      errors: err.flatten(),
    });
  }

  // Prisma - Unique constraint
  if (
    err instanceof PrismaClientKnownRequestError &&
    err.code === "P2002"
  ) {
    return res.status(409).json({
      error: "Registro já existe",
    });
  }

  console.error("❌ Erro não tratado:", err);

  return res.status(500).json({
    error: "Erro interno do servidor",
  });
}

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class UserService {
  static async list(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { id: "asc" },
      }),
      prisma.user.count(),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async create(data: { name: string; email: string }) {
    return prisma.user.create({
      data,
    });
  }
}

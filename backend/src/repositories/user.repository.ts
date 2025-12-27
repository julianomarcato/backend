import { prisma } from "../prisma/client";

export class UserRepository {
  async create(name: string, email: string) {
    return prisma.user.create({
      data: { name, email },
    });
  }

  async findAll() {
    return prisma.user.findMany();
  }
}

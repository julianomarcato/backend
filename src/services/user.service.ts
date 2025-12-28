import { prisma } from '../lib/prisma'

export class UserService {
  static async getMe(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    })
  }
}

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
class PasswordResetTokenRepository {
  async create(userId, token, expiresAt) {
    return await this.prisma.PasswordResetTokenRepository.create({
      data: {
        userId,
        token,
        expiresAt,
        used: false,
      },
    });
  }
}

export default PasswordResetTokenRepository;

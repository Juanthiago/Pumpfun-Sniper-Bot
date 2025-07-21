class PasswordResetTokenRepository {
  constructor() {
    this.prisma = Prisma;
  }

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

module.exports = PasswordResetTokenRepository;

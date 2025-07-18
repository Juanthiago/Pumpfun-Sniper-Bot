const { v4: uuidv4 } = require("uuid");

class PrismaEmailVerificationTokenRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async createToken(userId) {
    const token = uuidv4();

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const tokenData = await this.prisma.emailVerificationToken.create({
      data: {
        userId,
        token,
        expiresAt,
        used: false,
      },
    });

    return tokenData;
  }
}

module.exports = PrismaEmailVerificationTokenRepository;

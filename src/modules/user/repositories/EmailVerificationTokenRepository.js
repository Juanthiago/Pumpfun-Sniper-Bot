import { v4 as uuidv4 } from "uuid";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class EmailVerificationTokenRepository {
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

export default EmailVerificationTokenRepository;

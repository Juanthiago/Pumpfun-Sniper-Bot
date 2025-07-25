import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class SessionRepositories {
  async createSession(userId, token, expiresAt) {
    return await prisma.session.create({
      data: { userId, token, expiresAt },
    });
  }
}

export default SessionRepositories;

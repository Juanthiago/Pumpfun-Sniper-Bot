const { PrismaClient } = require("@prisma/client");
const Prisma = new PrismaClient();

class SessionRepositories {
  async createSession(userId, token, expiresAt) {
    return await Prisma.session.create({ data: { userId, token, expiresAt } });
  }
}

module.exports = SessionRepositories;

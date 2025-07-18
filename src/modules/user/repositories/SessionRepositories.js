class SessionRepositories {
  async createSession(userId, token, expiresAt) {
    return await Prisma.Session.create({ data: userId, token, expiresAt });
  }
}

class PrismaUserRepositories {
  // cria um usuario
  async create(userData) {
    return await Prisma.User.create({ data: userData });
  }

  // busca um usuario por id incluindo as relações
  async findById(id) {
    return await Prisma.User.findByUnique({
      where: { id, deletedAt: null },
      include: { teams: true, profile: true, tasks: true },
    });
  }

  // busca um usuario por email
  async findByEmail(email) {
    return await Prisma.User.findByUnique({ where: { email } });
  }

  // atualiza um usuario
  async update(id, userData) {
    return await Prisma.User.update({
      where: { id },
      data: userData,
    });
  }

  // atualiza o deletedAt para soft delete
  async softDelete(id) {
    return await Prisma.User.update({
      where: { id },
      data: { deletedAt: new Date(), updatedAt: new Date() },
    });
  }

  // busca usuarios recentes
  async findByRecent(limit = 10) {
    return await Prisma.User.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  // busca usuarios por nome
  async findByName(name) {
    return await Prisma.User.findMany({
      where: { name, deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  }
}

module.exports = PrismaUserRepositories;

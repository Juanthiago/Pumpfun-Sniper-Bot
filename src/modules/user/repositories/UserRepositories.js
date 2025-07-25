import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
class UserRepositories {
  // cria um usuario
  async create(userData) {
    return await prisma.user.create({ data: userData });
  }

  // busca um usuario por id incluindo as relações
  async findById(id) {
    return await prisma.user.findUnique({
      where: { id, deletedAt: null },
      include: { teams: true, profile: true, tasks: true },
    });
  }

  // busca um usuario por email
  async findByEmail(email) {
    return await prisma.user.findUnique({ where: { email } });
  }

  // atualiza um usuario
  async update(id, userData) {
    return await prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  // atualiza o deletedAt para soft delete
  async softDelete(id) {
    return await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), updatedAt: new Date() },
    });
  }

  // busca usuarios recentes
  async findByRecent(limit = 10) {
    return await prisma.user.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  // busca usuarios por nome
  async findByName(name) {
    return await prisma.user.findMany({
      where: { name, deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  }
}

export default UserRepositories;

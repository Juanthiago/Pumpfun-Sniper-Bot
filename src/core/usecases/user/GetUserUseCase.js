import { userRepositories } from "../../modules/user/repositories/UserRepositories";

class GetUserUseCase {
  constructor(userRepositories) {
    this.userRepositories = userRepositories;
  }
  async execute(id) {
    const user = await this.userRepositories.findById(id);
    if (!user || user.deletedAt) throw new Error("User not found");
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

module.exports = GetUserUseCase;

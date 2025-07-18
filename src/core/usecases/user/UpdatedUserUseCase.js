import { userRepositories } from "../../modules/user/repositories/UserRepositories";

class UpdatedUserUseCase {
  constructor(userRepositories) {
    this.userRepositories = userRepositories;
  }

  async execute(id, userData) {
    const user = await this.userRepositories.findById(id);
    if (!user || user.deletedAt) throw new Error("User not found");

    const updatedUser = await this.userRepositories.update(id, {
      ...userData,
      updatedAt: new Date(),
    });
    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      updatedAt: updatedUser.updatedAt,
    };
  }
}

module.exports = UpdatedUserUseCase;

import { UserRepositories } from "../../modules/user/repositories/UserRepositories";

class UpdatedUserUseCase {
  constructor(UserRepositories) {
    this.UserRepositories = UserRepositories;
  }

  async execute(id, userData) {
    const user = await this.UserRepositories.findById(id);
    if (!user || user.deletedAt) throw new Error("User not found");

    const updatedUser = await this.UserRepositories.update(id, {
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

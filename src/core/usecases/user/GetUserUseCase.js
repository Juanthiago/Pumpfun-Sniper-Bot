import UserRepositories from "../../modules/user/repositories/UserRepositories.js";

class GetUserUseCase {
  constructor(UserRepositories) {
    this.UserRepositories = UserRepositories;
  }
  async execute(id) {
    const user = await this.UserRepositories.findById(id);
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

export default GetUserUseCase;

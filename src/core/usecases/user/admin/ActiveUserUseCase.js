import UserRepositories from "../../modules/user/repositories/UserRepositories.js";

class ActiveUserUseCase {
  constructor(UserRepositories) {
    this.UserRepositories = UserRepositories;
  }
  async execute(id, user) {
    if (user.role !== "admin") {
      throw new Error("You are not authorized to active users");
    }
    const userExists = await this.UserRepositories.findById(id);
    if (!userExists || userExists.deletedAt) throw new Error("User not found");
    const activatedUser = await this.UserRepositories.activate(id);
    return {
      message: "User activated successfully",
      user: activatedUser,
    };
  }
}

export default ActiveUserUseCase;

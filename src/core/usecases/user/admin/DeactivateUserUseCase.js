import UserRepositories from "../../modules/user/repositories/UserRepositories.js";

class DeactivateUserUseCase {
  constructor(UserRepositories) {
    this.UserRepositories = UserRepositories;
  }
  async execute(id, user) {
    if (user.role !== "admin") {
      throw new Error("You are not authorized to deactivate users");
    }
    const userExists = await this.UserRepositories.findById(id);
    if (!userExists || userExists.deletedAt) throw new Error("User not found");
    const deactivatedUser = await this.UserRepositories.softDelete(id);
    return {
      message: "User deactivated successfully",
      user: deactivatedUser,
    };
  }
}

export default DeactivateUserUseCase;

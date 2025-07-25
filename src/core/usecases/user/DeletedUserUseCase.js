import UserRepositories from "../../../modules/user/repositories/UserRepositories.js";

class DeleteUserUseCase {
  constructor(UserRepositories) {
    this.UserRepositories = UserRepositories;
  }

  async execute(id) {
    const user = await this.UserRepositories.softDelete(id);
    if (!user || user.deletedAt) throw new Error("User not found");

    await this.UserRepositories.softDelete(id);

    return {
      message: "User deleted successfully",
    };
  }
}

export default DeleteUserUseCase;

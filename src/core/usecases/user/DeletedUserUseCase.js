import { UserRepositories } from "../../modules/user/repositories/UserRepositories";

export class DeleteUserUseCase {
  constructor(userRepositories) {
    this.userRepositories = userRepositories;
  }

  async execute(id) {
    const user = await this.userRepositories.softDelete(id);
    if (!user || user.deletedAt) throw new Error("User not found");

    await this.userRepositories.softDelete(id);

    return {
      message: "User deleted successfully",
    };
  }
}

import UserRepositories from "../../modules/user/repositories/UserRepositories.js";

class ListUsersUseCase {
  constructor(UserRepositories) {
    this.UserRepositories = UserRepositories;
  }
  async execute(user) {
    if (!user.role === "admin") {
      throw new Error("You are not authorized to list users");
    }
    const users = await this.UserRepositories.findAll();
    return users;
  }
}

export default ListUsersUseCase;

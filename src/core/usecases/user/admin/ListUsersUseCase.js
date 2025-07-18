class ListUsersUseCase {
  constructor(userRepositories) {
    this.userRepositories = userRepositories;
  }
  async execute(user) {
    if (!user.role === "admin") {
      throw new Error("You are not authorized to list users");
    }
    const users = await this.userRepositories.findAll();
    return users;
  }
}

module.exports = ListUsersUseCase;

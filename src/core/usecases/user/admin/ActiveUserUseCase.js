class ActiveUserUseCase {
  constructor(userRepositories) {
    this.userRepositories = userRepositories;
  }
  async execute(id, user) {
    if (user.role !== "admin") {
      throw new Error("You are not authorized to active users");
    }
    const userExists = await this.userRepositories.findById(id);
    if (!userExists || userExists.deletedAt) throw new Error("User not found");
    const activatedUser = await this.userRepositories.activate(id);
    return {
      message: "User activated successfully",
      user: activatedUser,
    };
  }
}

module.exports = ActiveUserUseCase;

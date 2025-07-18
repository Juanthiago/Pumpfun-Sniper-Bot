class DeactivateUserUseCase {
  constructor(userRepositories) {
    this.userRepositories = userRepositories;
  }
  async execute(id, user) {
    if (user.role !== "admin") {
      throw new Error("You are not authorized to deactivate users");
    }
    const userExists = await this.userRepositories.findById(id);
    if (!userExists || userExists.deletedAt) throw new Error("User not found");
    const deactivatedUser = await this.userRepositories.softDelete(id);
    return {
      message: "User deactivated successfully",
    };
  }
}

module.exports = DeactivateUserUseCase;

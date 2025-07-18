import { sessionRepositories } from "../../modules/user/repositories/UserRepositories";

class LogoutUserUseCase {
  constructor(sessionRepositories) {
    this.sessionRepositories = sessionRepositories;
  }

  async execute(id) {
    const session = await this.sessionRepositories.findById(id);
    if (!session || session.deletedAt) throw new Error("Session not found");

    const LogoutUser = await this.sessionRepositories.invalidateSessionForUser(
      userId
    );
    return {
      message: "User logged out successfully",
    };
  }
}

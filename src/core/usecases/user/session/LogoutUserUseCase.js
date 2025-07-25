import SessionRepositories from "../../modules/user/repositories/SessionRepositories.js";

class LogoutUserUseCase {
  constructor(SessionRepositories) {
    this.SessionRepositories = SessionRepositories;
  }

  async execute(id) {
    const session = await this.SessionRepositories.findById(id);
    if (!session || session.deletedAt) throw new Error("Session not found");

    const LogoutUser = await this.SessionRepositories.invalidateSessionForUser(
      userId
    );
    return {
      message: "User logged out successfully",
    };
  }
}

export default LogoutUserUseCase;

import crypto from "crypto";
import UserRepositories from "../../modules/user/repositories/UserRepositories.js";

class RecoverUserPasswordUseCase {
  constructor(UserRepositories) {
    this.UserRepositories = UserRepositories;
  }

  async execute(email) {
    const user = await this.UserRepositories.findByEmail(email);
    if (!user || user.deletedAt) throw new Error("User not found");

    const token = crypto.randomBytes(34).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.UserRepositories.createToken({
      userId: user.id,
      token,
      expiresAt,
    });

    return {
      message: "User password recovery email sent successfully",
      user,
    };
  }
}

export default RecoverUserPasswordUseCase;

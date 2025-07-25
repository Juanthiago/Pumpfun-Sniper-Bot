import UserRepositories from "../../modules/user/repositories/UserRepositories.js";
import PasswordResetTokenRepository from "../../modules/user/repositories/PasswordResetTokenRepository.js";
import bcrypt from "bcrypt";

class ChangeUserPasswordUseCase {
  constructor(UserRepositories, PasswordResetTokenRepository) {
    this.UserRepositories = UserRepositories;
    this.PasswordResetTokenRepository = PasswordResetTokenRepository;
  }
  async execute(userId, password, token) {
    const user = await this.UserRepositories.findById(userId);
    if (!user || user.deletedAt) throw new Error("User not found");

    const hashPassword = await bcrypt.hash(password, 8);

    const tokenData = await this.PasswordResetTokenRepository.findByToken(
      token
    );
    if (!tokenData || tokenData.used) throw new Error("Invalid token");

    const updatedUser = await this.UserRepositories.update(id, {
      ...user,
      password: hashPassword,
    });

    await this.PasswordResetTokenRepository.update(tokenData.id, {
      ...tokenData,
      used: true,
    });

    return {
      message: "User password changed successfully",
      user: updatedUser,
    };
  }
}

export default ChangeUserPasswordUseCase;

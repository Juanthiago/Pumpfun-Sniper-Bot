import UserRepositories from "../../modules/user/repositories/UserRepositories.js";
import VerifyUserEmailUseCaseRepository from "../../modules/user/repositories/VerifyUserEmailUseCaseRepository.js";

class VerifyUserEmailUseCase {
  constructor(UserRepositories, VerifyUserEmailUseCaseRepository) {
    this.UserRepositories = UserRepositories;
    this.VerifyUserEmailUseCaseRepository = VerifyUserEmailUseCaseRepository;
  }

  async execute(token) {
    const tokenData = await this.VerifyUserEmailUseCaseRepository.findByToken(
      token
    );

    if (!tokenData || tokenData.used) throw new Error("Invalid token");

    const user = await this.UserRepositories.findById(tokenData.userId);

    if (!user || user.deletedAt) throw new Error("User not found");

    const updatedUser = await this.UserRepositories.update(tokenData.userId, {
      ...user,
      emailVerifiedAt: new Date(),
    });

    await this.VerifyUserEmailUseCaseRepository.update(tokenData.id, {
      ...tokenData,
      used: true,
    });

    return {
      message: "User email verified successfully",
      user: updatedUser,
    };
  }
}

export default VerifyUserEmailUseCase;

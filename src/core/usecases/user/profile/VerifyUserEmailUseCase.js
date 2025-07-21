class VerifyUserEmailUseCase {
  constructor(userRepositories, VerifyUserEmailUseCaseRepository) {
    this.userRepositories = userRepositories;
    this.VerifyUserEmailUseCaseRepository = VerifyUserEmailUseCaseRepository;
  }

  async execute(token) {
    const tokenData = await this.VerifyUserEmailUseCaseRepository.findByToken(
      token
    );

    if (!tokenData || tokenData.used) throw new Error("Invalid token");

    const user = await this.userRepositories.findById(tokenData.userId);

    if (!user || user.deletedAt) throw new Error("User not found");

    const updatedUser = await this.userRepositories.update(tokenData.userId, {
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

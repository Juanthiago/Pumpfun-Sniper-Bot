class ChangeUserPasswordUseCase {
  constructor(userRepositories, passwordResetTokenRepository) {
    this.userRepositories = userRepositories;
    this.passwordResetTokenRepository = passwordResetTokenRepository;
  }
  async execute(id, password, token) {
    const user = await this.userRepositories.findById(id);
    if (!user || user.deletedAt) throw new Error("User not found");

    const hashPassword = await bcrypt.hash(password, 8);

    const tokenData = await this.passwordResetTokenRepository.findByToken(
      token
    );
    if (!tokenData || tokenData.used) throw new Error("Invalid token");

    const updatedUser = await this.userRepositories.update(id, {
      ...user,
      password: hashPassword,
    });

    await this.passwordResetTokenRepository.update(tokenData.id, {
      ...tokenData,
      used: true,
    });

    return {
      message: "User password changed successfully",
      user: updatedUser,
    };
  }
}

module.exports = ChangeUserPasswordUseCase;

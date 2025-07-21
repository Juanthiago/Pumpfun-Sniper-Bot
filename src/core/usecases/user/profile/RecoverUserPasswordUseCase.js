class RecoverUserPasswordUseCase {
  constructor(userRepositories) {
    this.userRepositories = userRepositories;
  }

  async execute(email) {
    const user = await this.userRepositories.findByEmail(email);
    if (!user || user.deletedAt) throw new Error("User not found");

    const token = crypto.randomBytes(34).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.userRepositories.createToken({
      userId: user.id,
      token,
      expiresAt,
    });
  }
}

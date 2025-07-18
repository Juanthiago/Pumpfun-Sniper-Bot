import { sessionRepositories } from "../../modules/user/repositories/SessionRepositories";
import bcrypt from "bcrypt";

class LoginUserUseCase {
  constructor(sessionRepositories) {
    this.sessionRepositories = sessionRepositories;
  }
  async execute(email, password) {
    const userLogin = await this.sessionRepositories.createSession(
      email,
      password,
      new Date(),
      new Date()
    );
    if (!userLogin || userLogin.deletedAt) throw new Error("User not found");

    const isPasswordValid = await bcrypt.compare(password, userLogin.password);

    if (!isPasswordValid) throw new Error("Invalid password");

    return {
      id: userLogin.id,
      name: userLogin.name,
      email: userLogin.email,
      role: userLogin.role,
      createdAt: userLogin.createdAt,
      updatedAt: userLogin.updatedAt,
    };
  }
}

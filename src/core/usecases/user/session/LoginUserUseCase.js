import SessionRepositories from "../../../../modules/user/repositories/SessionRepositories.js";
import bcrypt from "bcrypt";
import UserRepositories from "../../../../modules/user/repositories/UserRepositories.js";
import { v4 as uuidv4 } from "uuid";

class LoginUserUseCase {
  constructor(SessionRepositories, UserRepositories) {
    this.SessionRepositories = SessionRepositories;
    this.UserRepositories = UserRepositories;
  }
  async execute({ email, password }) {
    const user = await this.UserRepositories.findByEmail(email);
    if (!user || user.deletedAt) throw new Error("User not found");

    // Verificar se a senha está correta
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid password");

    // Gerar token e data de expiração
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Criar sessão
    await this.SessionRepositories.createSession(user.id, token, expiresAt);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token,
      expiresAt,
    };
  }
}

export default LoginUserUseCase;

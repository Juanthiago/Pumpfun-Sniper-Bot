import UserRepositories from "../../../../modules/user/repositories/UserRepositories.js";
import bcrypt from "bcrypt";

class RegisterUserUseCase {
  constructor(UserRepositories) {
    this.UserRepositories = UserRepositories;
  }

  async execute(userData) {
    const userExists = await this.UserRepositories.findByEmail(userData.email);
    if (userExists) throw new Error("User already exists");

    const hashPassword = await bcrypt.hash(userData.password, 8);

    const newUser = {
      ...userData,
      password: hashPassword,
    };

    const createdUser = await this.UserRepositories.create(newUser);

    return createdUser;
  }
}

export default RegisterUserUseCase;

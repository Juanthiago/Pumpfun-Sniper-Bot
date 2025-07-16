import { UserRepositories } from "../../modules/user/repositories/UserRepositories";
import bcrypt from "bcrypt";

export class CreateUserUseCase {
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

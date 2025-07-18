import { userRepositories } from "../../modules/user/repositories/UserRepositories";
import bcrypt from "bcrypt";

export class CreateUserUseCase {
  constructor(userRepositories) {
    this.userRepositories = userRepositories;
  }

  async execute(userData) {
    const userExists = await this.userRepositories.findByEmail(userData.email);
    if (userExists) throw new Error("User already exists");

    const hashPassword = await bcrypt.hash(userData.password, 8);

    const newUser = {
      ...userData,
      password: hashPassword,
    };

    const createdUser = await this.userRepositories.create(newUser);

    return createdUser;
  }
}

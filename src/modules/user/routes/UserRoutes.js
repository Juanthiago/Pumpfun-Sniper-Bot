import UserController from "../controllers/UserController.js";
import RegisterUserUseCase from "../../../core/usecases/user/session/RegisterUserUseCase.js";
import LoginUserUseCase from "../../../core/usecases/user/session/LoginUserUseCase.js";
import UserRepositories from "../repositories/UserRepositories.js";
import SessionRepositories from "../repositories/SessionRepositories.js";

async function UserRoutes(fastify, options) {
  const userRepositories = new UserRepositories();
  const sessionRepositories = new SessionRepositories();
  const registerUserUseCase = new RegisterUserUseCase(userRepositories);
  const loginUserUseCase = new LoginUserUseCase(
    sessionRepositories,
    userRepositories
  );
  const userController = new UserController(
    registerUserUseCase,
    loginUserUseCase
  );

  fastify.post("/register", userController.handleRegister.bind(userController));
  fastify.post("/login", userController.handleLogin.bind(userController));
}

export default UserRoutes;

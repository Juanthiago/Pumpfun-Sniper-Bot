class UserController {
  constructor(registerUserUseCase, loginUserUseCase) {
    this.registerUserUseCase = registerUserUseCase;
    this.loginUserUseCase = loginUserUseCase;
  }

  async handleRegister(request, reply) {
    try {
      const { name, email, password } = request.body;

      const user = await this.registerUserUseCase.execute({
        name,
        email,
        password,
      });

      return reply.code(201).send(user);
    } catch (error) {
      return reply.code(400).send({ error: error.message });
    }
  }

  async handleLogin(request, reply) {
    try {
      const { email, password } = request.body;

      const user = await this.loginUserUseCase.execute({
        email,
        password,
      });
      return reply.code(200).send(user);
    } catch (error) {
      return reply.code(400).send({ error: error.message });
    }
  }
}
export default UserController;

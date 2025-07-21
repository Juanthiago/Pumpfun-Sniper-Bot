export class RegisterController {
  constructor(registerUserUseCase) {
    this.registerUserUseCase = registerUserUseCase;
  }

  async handle(request, response) {
    const { name, email, password } = request.body;

    const user = await this.registerUserUseCase.execute({
      name,
      email,
      password,
    });

    return response.status(201).json(user);
  }
  catch(error) {
    return response.status(400).json({ error: error.message });
  }
}

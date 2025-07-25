// server.js
import Fastify from "fastify";
import UserRoutes from "./src/modules/user/routes/UserRoutes.js";

const fastify = Fastify({ logger: true });

// Rota básica para teste
fastify.get("/", async (request, reply) => {
  return { message: "Zuppo Backend está rodando com Fastify!" };
});

fastify.register(UserRoutes);

// Inicia o servidor
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    fastify.log.info(`Servidor rodando em http://localhost:3000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

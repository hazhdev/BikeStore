import "dotenv/config";
import fastify from "fastify";

export const app = fastify({ logger: true });
const PORT = Number(process.env.PORT) || 5000;

app.listen({ port: PORT }, (err, address) => {
  console.log(`Server running at ${address}`);
});

import type { FastifyInstance } from "fastify";
import { RegisterSchema, RegisterType } from "./schemas";
import { error, ok } from "./utils";

export default async function (app: FastifyInstance) {
  let prisma = app.prisma;
  app.post<{ Body: RegisterType }>(
    "/register",
    {
      schema: {
        body: RegisterSchema,
      },
    },
    async (req, rep) => {
      if (req.body.code !== app.code) {
        rep.code(401).send(error("invalid code", null));
      } else {
        let client = await prisma.client.create({
          data: {
            nickname: req.body.nickname,
          }
        })
        let jwt = app.jwt.sign({
          id: client.id,
        })
        rep.send(ok(jwt))
      }
    }
  );
}

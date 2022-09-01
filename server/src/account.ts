import type { FastifyInstance } from "fastify";
import { RegisterSchema, RegisterType } from "./schemas";
import { error, ok } from "./utils";

export default async function (app: FastifyInstance) {
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
        rep.send(ok("'code'"))
      }
    }
  );
}

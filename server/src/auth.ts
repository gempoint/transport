import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { error } from "./utils";

export default async function (app: FastifyInstance) {
  let jwt = app.jwt;
  let prisma = app.prisma;
  app.decorate('verify', async (req: FastifyRequest, rep: FastifyReply) => {
    console.log(req.headers.authorization)
    try {
      if (!req.headers.authorization) {
        rep.status(401).send(error("no auth token was sent", null))
      } else {
        const token = req.headers.authorization.replace('Bearer ', '')
        await jwt.verify(token)
        const data = JSON.parse(token) as {
          id: string
        }
        const client = await prisma.client.findFirst({
          where: {
            id: data.id
          }
        })
        app.decorateRequest('client', client)
      }
    } catch (err) {
      rep.status(500).send(error(`internal error: ${err.message}`, err.stack))
    }
  })
}


declare module "fastify" {
  interface FastifyInstance {
    verify: (req: FastifyRequest, rep: FastifyReply) => void
  }
}

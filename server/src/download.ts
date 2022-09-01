import { FastifyInstance } from "fastify";
import { ok } from "./utils";

let cache = "";

export default async function (app: FastifyInstance) {
  let folder = app.folder;
  app.get("/firstTime", async (_req, rep) => {
    let url = cache ? cache : (cache = await folder.link({}));
    rep.send(ok(url));
  });
}

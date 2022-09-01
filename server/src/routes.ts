import type { FastifyInstance } from "fastify";
import prettyBytes from "pretty-bytes";
import download from "./download";
import { commitId, forHumans } from "./utils";

export default async function (app: FastifyInstance) {
  // random startup code bc its async here
  let storage = app.mega;
  await storage.ready;
  let folder = storage.root.children.find((file) => file.name === "cloud");
  // console.log(folder)
  if (!folder) {
    folder = await storage.mkdir("cloud");
  }
  app.decorate("folder", folder);

  const recalculate = async () => (await storage.getAccountInfo()).spaceUsed;

  app.decorate("size", await recalculate());
  const actions = ["add", "delete", "update", "move"] as const;
  actions.forEach((x) => {
    storage.on(x, async () => {
      await recalculate();
    });
  });
  // storage.on('')

  app.get("/", async (_req, rep) => {
    let uptime: number = process.uptime();
    rep.send({
      uptime: forHumans(Number(uptime.toFixed(0))),
      version: `${process.env.npm_package_version}-${commitId()}`,
      storageStatus: storage.status,
      storageUsed: prettyBytes(app.size),
    });
  });
  app.register(download, { prefix: "/download" });
}

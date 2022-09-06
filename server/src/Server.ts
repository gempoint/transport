import { fastify, FastifyInstance } from "fastify";
//import { TypeBoxTypeProvider, TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox'
import helmet from "@fastify/helmet";
import fastifyJWT from "@fastify/jwt"
import { CleanedEnvAccessors } from "envalid";
import { MutableFile, Storage } from "megajs";
import routes from "./routes";
import { error as err, red } from "./utils"
import { DEFAULTCODE, DEFAULTSECRET } from "./constants";
import { PrismaClient } from "@prisma/client";
import fastifyAuth from "@fastify/auth"
import auth from "./auth";

const log = console.log;
const error = console.error;

class Server {
  public api: FastifyInstance;
  constructor(x: huh) {
    // log(x.isDev)
    this.api = fastify({
      logger: x.isDev,
    });
    //this.api.setValidatorCompiler(TypeBoxValidatorCompiler).withTypeProvider<TypeBoxTypeProvider>()
    this.addStuff(x)
      .then(() => { })
      .catch((e) => {
        log(`something went wrong adding stuff: ${e}`);
      });
    this.addRoutes();
    this.api
      .listen({ port: Number(process.env.PORT) || 3000, host: '0.0.0.0' })
      .then(() => {
        log("server started successfully");
      })
      .catch((err) => {
        error(`fastify server error: ${err.stack}`);
      });
  }

  async addStuff(x: huh) {
    let api = this.api;
    if (x.CODE === DEFAULTCODE) {
      red("USING DEFAULT CODE! PLEASE CHANGE!")
    }
    if (x.SECRET === DEFAULTSECRET) {
      red("USING DEFAULT SECRET! PLEASE CHANGE!")
    }
    api.register(helmet, { contentSecurityPolicy: false });
    api.register(fastifyJWT, {
      secret: x.SECRET
    })
    api.register(fastifyAuth)
    api.setErrorHandler((error, _req, rep) => {
      //console.log(err.)
      rep.status(400).send(err(error.message, error.stack));
    });
    let storage = new Storage(
      {
        email: x.EMAIL,
        password: x.PASSWORD,
        keepalive: true,
      },
      (err) => {
        if (!err) {
          log('no err logging into mega')
        } else {
          error(`something went wrong with logging into mega: ${err}`)
        }
      }
    );
    // let storage = await _storage.ready
    api.decorate("mega", storage);
    api.decorate("code", x.CODE)
    let prisma = new PrismaClient()
    api.decorate('prisma', prisma);
    api.register(auth)
  }

  addRoutes() {
    this.api.register(routes);
  }
}

export default Server;

type huh = Readonly<
  {
    EMAIL: string;
    PASSWORD: string;
    CODE: string;
    SECRET: string;
  } & CleanedEnvAccessors
>;

declare module "fastify" {
  interface FastifyInstance {
    mega: Storage;
    folder: MutableFile;
    size: number;
    code: string
    prisma: PrismaClient;
  }
}

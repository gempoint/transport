import { fastify, FastifyInstance } from 'fastify';
//import { TypeBoxTypeProvider, TypeBoxValidatorCompiler } from '@fastify/type-provider-typebox'
import helmet from '@fastify/helmet'
import { CleanedEnvAccessors } from 'envalid';
import { Storage } from "megajs"

const log = console.log
const error = console.error

class Server {
  public api: FastifyInstance
  constructor(x: huh) {
    this.api = fastify({
      logger: true
    })
    //this.api.setValidatorCompiler(TypeBoxValidatorCompiler).withTypeProvider<TypeBoxTypeProvider>()
    this.addStuff(x).then(() => { }).catch((e) => { log(`something went wrong adding stuff: ${e}`) })
    this.addRoutes()
    this.api.listen(3000).then(() => {
      log('server started successfully')
    }).catch((err) => {
      error('fastify server error: ' + err)
    })
  }

  async addStuff(x: huh) {
    let api = this.api
    api.register(helmet, { contentSecurityPolicy: false })
    api.setErrorHandler((err, _req, rep) => {
      //console.log(err.)
      rep.status(400).send({
        ok: false,
        data: err.message
      })
    })
    let storage = await new Storage({
      email: x.EMAIL,
      password: x.PASSWORD,
      keepalive: true,
    }).ready
  }

  addRoutes() {
    this.api.register(routes)
  }
}

export default Server;


type huh = Readonly<{
  EMAIL: string;
  PASSWORD: string;
} & CleanedEnvAccessors>

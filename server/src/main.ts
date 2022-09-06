require("dotenv").config();
import { cleanEnv, str } from "envalid";
import Server from "./Server";
import { DEFAULTCODE, DEFAULTSECRET } from "./constants"

const env = cleanEnv(process.env, {
  EMAIL: str(),
  PASSWORD: str(),
  CODE: str({ default: DEFAULTCODE }),
  SECRET: str({ default: DEFAULTSECRET }),
});

try {
  new Server(env);
} catch (e) {
  console.error("global server error: " + e);
}

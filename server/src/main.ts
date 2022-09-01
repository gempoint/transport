require("dotenv").config();
import { cleanEnv, str } from "envalid";
import Server from "./Server";

const env = cleanEnv(process.env, {
  EMAIL: str(),
  PASSWORD: str(),
  CODE: str({default: '0x0isthebest'}),
});

try {
  new Server(env);
} catch (e) {
  console.error("global server error: " + e);
}

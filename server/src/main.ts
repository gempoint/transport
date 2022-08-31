require('dotenv').config()
import { cleanEnv, str } from 'envalid';
import Server from './Server';


const env = cleanEnv(process.env, {
  EMAIL: str(),
  PASSWORD: str(),
})

try {
  new Server(env);
} catch (e) {
  console.error('global server error: ' + e);
}

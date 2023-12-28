// import { dirname } from 'path'
import path from 'path'
const __dirname = path.resolve()
import dotenv from 'dotenv'

// note, 'import' seems to be relative to the file that imports it...!!
// so we use __dirname to make sure we get the ../docker/.env
const envFile = `${__dirname}/../docker/.env`
console.debug('ENVFILE', envFile)
dotenv.config({ path: envFile });

// console.debug('config/dotenv.js', process.env)

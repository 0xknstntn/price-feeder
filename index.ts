import { Main } from "./src";
import dotenv from 'dotenv';
dotenv.config();
Main(process.env.MNEMONIC!, process.env.VALIDATOR!)
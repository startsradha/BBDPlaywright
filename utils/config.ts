import * as dotenv from 'dotenv';
import * as path from 'path';
// Captures ENV variable value from terminal; defaults to 'dev' target profile
const environment = process.env.ENV || 'dev';
// Maps and resolves the precise path matching the active profile target 
const envFilePath = path.resolve(__dirname, `../env/.env.${environment}`);
dotenv.config({ path: envFilePath });
export const Config = {
  baseUrl: process.env.BASE_URL || 'https://saucedemo.com',
  environment: environment.toUpperCase()
};
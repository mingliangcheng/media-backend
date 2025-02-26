import * as yaml from 'js-yaml';
import * as path from 'node:path';
const config_dev_name = 'development.yaml';
const config_prod_name = 'production.yaml';
import { readFileSync } from 'fs';
import * as process from 'node:process';
const isDev = process.env['NODE_ENV'] === 'development';
const configPath = path.join(
  __dirname,
  isDev ? config_dev_name : config_prod_name,
);
export default () => {
  return yaml.load(readFileSync(configPath, 'utf-8')) as Record<string, any>;
};

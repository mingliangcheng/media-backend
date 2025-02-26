export interface DbInterface {
  type: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  [key: string]: any;
}

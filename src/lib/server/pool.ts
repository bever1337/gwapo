import { env } from "$env/dynamic/private";
import { Pool } from "pg";

export const pool = new Pool({
  connectionTimeoutMillis: 4200,
  database: env.PGDATABASE,
  password: env.PGPASSWORD,
  port: Number.parseInt(env.PGPORT!, 10),
  user: env.PGUSER,
});

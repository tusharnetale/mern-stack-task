// import { createPool } from "mysql2";
// import { Kysely, MysqlDialect } from "kysely";
// import { Database } from "@/types/index";

// const dialect = new MysqlDialect({
//   pool: createPool({
//     database: process.env.DB_NAME as "prod_db",
//     host: process.env.HOST as "localhost",
//     user: process.env.USER_NAME as "root",
//     password: process.env.PASSWORD as "root",
    
//     connectionLimit: 999,
//   }),
// });

// export const db = new Kysely<Database>({
//   dialect,
// });


import { createPool } from "mysql2";
import { Kysely, MysqlDialect } from "kysely";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const dialect = new MysqlDialect({
  pool: createPool({
    database: process.env.DB_NAME || "prod_db",
    host: process.env.HOST || "localhost",
    user: process.env.USER_NAME || "root",
    password: process.env.PASSWORD || "root",
    port: Number(process.env.DB_PORT) || 3306,
    connectionLimit: 10,
  }),
});

export const db = new Kysely<'prod_db'>({ dialect });

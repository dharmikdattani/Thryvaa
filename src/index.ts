import http from 'http';
import mysql from "mysql2";
import { app } from "./config/express";
import { logger } from "./config/logger";
import { sequelize } from './config/database';


const PORT: number = (process.env.PORT && +process.env.PORT) || 8000;
const server: http.Server = http.createServer(app);
const access: mysql.ConnectionOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
}


async function startServer() {
  // Sequelize database setup
  await sequelize
    .sync()
    .then(() => logger.info("Database synchronized"))
    .catch((error) => logger.error("Error syncing database:", error));

  // DB connection
  const conn: mysql.Connection = mysql.createConnection(access);

  conn.connect((err: mysql.QueryError | null) => {
    if (err) {
      logger.error('🛑 MySQL connection error:');
      logger.error(err instanceof AggregateError ? err.errors : err.stack);
      process.exit(1);
    }
    logger.info("🚀🚀 Database connection created");

    server.listen(PORT, () => {
      logger.info(`Server is running on ${PORT}...`);
    });
  });

}

startServer();
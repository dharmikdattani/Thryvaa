import path from 'path';
import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

// Define __dirname for ES modules
const config = require(path.join(__dirname, '../../config/config.json'));


// Determine the environment (development, production, test)
const env = process.env?.NODE_ENV || 'development';

// Get the corresponding config for the current environment
const dbConfig = config[env];

export const sequelize = new Sequelize({
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    host: dbConfig.host,
    port: dbConfig.dbPort,
    timezone: '+00:00', // Use '+00:00' instead of 'Z' for MySQL
    dialect: dbConfig.dialect as Dialect,
    logging: false,
});
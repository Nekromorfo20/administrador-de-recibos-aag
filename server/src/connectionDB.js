import { Sequelize } from "sequelize"
import dotenv from "dotenv"
dotenv.config()

const ENV = process.env
const db = new Sequelize(
    ENV.API_DB_NAME,
    ENV.API_DB_USER,
    ENV.API_DB_PASSWORD,
    {
        host: ENV.API_DB_HOST,
        dialect: ENV.API_DB_DIALECT,
        logging: (ENV.API_DB_LOGGING === "true"),
        operatorsAliases: ENV.API_DB_OPERATOR_ALIASES,
        pool: {
            max: Number(ENV.API_DB_POOL_MAX),
            min: Number(ENV.API_DB_POOL_MIN),
            acquire: Number(ENV.API_DB_POOL_ACQUIRE),
            idle: Number(ENV.API_DB_POOL_IDLE)
        }
    })

export default db
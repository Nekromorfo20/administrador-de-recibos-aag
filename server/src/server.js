import express from "express"
import colors from "colors"
import cors from "cors"
import morgan from "morgan"
import fileUpload from "express-fileupload"
import swaggerUi from "swagger-ui-express"
import swaggerSpec, { swaggerUiOptions } from "./configs/swagger"
import db from "./configs/connectionDB"
import routerReceipt from "./routes/receipt.route"
import routerUser from "./routes/user.route"
import routerToken from "./routes/token.route"

/* Initialize server */
const server = express()
const ENV = process.env
const corsOptions = {
    origin: ENV.API_CORS_ORIGIN,
    credentials: ENV.API_CORS_CREDENTIALS
}

// Configuration server express, cors and morgan
server.use(express.json({ extended: true }))
server.use(express.urlencoded({ extended: true }))
server.use(cors(corsOptions))
server.use(morgan("dev"))
server.use(fileUpload())

/* Connect to DB */
const connectDB = async () => {
    try {
        await db.authenticate()
        db.sync()
    } catch (e) {
        console.log(e)
        console.log(colors.red.bold("¡An error ocurred while connecting to database!"))
        process.exit(1)
    }
}
connectDB()

/* Adding prefix to all routesm*/
server.use(ENV.API_PREFIX, routerReceipt)
server.use(ENV.API_PREFIX, routerUser)
server.use(ENV.API_PREFIX, routerToken)

/* Swagger API documentation */
server.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))

export default server
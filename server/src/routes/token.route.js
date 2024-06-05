import express from "express"
const router = express.Router()
import { auth } from "../middlewares"
import { TokenController } from "../controllers"

const tokenController = new TokenController()

/* Endpoint for log in an user session */
router.post("/log-in", tokenController.sessionLogIn)

/* Endpoint for refresh an user session token */
router.post("/refresh-token", tokenController.refreshToken)

/* Endpoint for sign out an user session */
router.post("/sign-out", auth, tokenController.sessionSignOut)

export default router
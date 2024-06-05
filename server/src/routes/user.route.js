import express from "express"
const router = express.Router()
import { auth } from "../middlewares"
import { UserController } from "../controllers"

const userController = new UserController()

/* Endpoint for Get an user */
router.get("/user", auth, userController.getUser)

/* Endpoint for Create a new user */
router.post("/user", userController.createUser)

/* Endpoint for Update an existing user */
router.put("/user", auth, userController.updateUser)

/* Endpoint for Update an user existing password */
router.patch("/user-update-password", auth, userController.updateUserPassword)

export default router
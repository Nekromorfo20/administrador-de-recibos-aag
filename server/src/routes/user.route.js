import express from "express"
const router = express.Router()
import { auth } from "../middlewares"
import { UserController } from "../controllers"

const userController = new UserController()

/* Endpoint for Get an existing user */
router.get("/user", auth, userController.getUser)

/* Endpoint for Create a new user */
router.post("/user", userController.createUser)

/* Endpoint for Update an existing user */
router.put("/user", auth, userController.updateUser)

/* Endpoint for Update an existing user password */
router.patch("/user-update-password", auth, userController.updateUserPassword)

/* Endpoint for Delete an existing user, their receipts and token information */
router.delete("/user", auth, userController.deleteUser)

export default router
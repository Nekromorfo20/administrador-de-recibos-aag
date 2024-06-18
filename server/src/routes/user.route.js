import express from "express"
const router = express.Router()
import { auth } from "../middlewares"
import { UserController } from "../controllers"

const userController = new UserController()

/**
 * @swagger
 *  components:
 *      schemas:
 *          User:
 *              type: object
 *              properties:
 *                  id:
 *                      type: string
 *                      description: The user ID
 *                      example: "1ede4103-d8fa-478a-87ce-ed0c2c9ac005"
 *                  fullName:
 *                      type: string
 *                      description: Full name of user
 *                      example: "John Doe"
 *                  email:
 *                      type: string
 *                      description: The email of user session
 *                      example: "example@email.com"
 *                  phoneNumber:
 *                      type: string
 *                      description: The phone number of user
 *                      example: "8812345678"
 *                  profileImg:
 *                      type: string
 *                      description: The url of profile image uploaded in AWS
 *                      example: "https://receipt-administrator.s3.us-east-2.amazonaws.com/profile-img.png"
 */

/* Endpoint for Get an existing user */
/**
 * @swagger
 * /api/user:
 *  get:
 *      summary: Get user information
 *      tags:
 *          - User
 *      description: Return basic user information
 *      parameters:
 *        - in: header
 *          name: x-auth-token
 *          description: The user session token to get information
 *          type: string
 *          required: true
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          403:
 *              description: Header session token invalid
 *          500:
 *              description: Server error
 */
router.get("/user", auth, userController.getUser)

/* Endpoint for Create a new user */
/**
 * @swagger
 * /api/user:
 *  post:
 *      summary: Create a new user
 *      tags:
 *          - User
 *      description: Create a new user for application
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          fullName:
 *                              type: string
 *                              example: "John Doe"
 *                          email:
 *                              type: string
 *                              example: "example@email.com"
 *                          password:
 *                              type: string
 *                              example: "abc123"
 *                          phoneNumber:
 *                              type: string
 *                              example: "8811223344"
 *                          profileImg:
 *                              type: string
 *                              format: binary
 *      responses:
 *          201:
 *              description: Successful response
 *          400:
 *              description: Information provided invalid / Email provided already register
 *          500:
 *              description: Server error
 */
router.post("/user", userController.createUser)

/* Endpoint for Update an existing user */
/**
 * @swagger
 * /api/user:
 *  put:
 *      summary: Update user information
 *      tags:
 *          - User
 *      description: Update an existing user information
 *      parameters:
 *        - in: header
 *          name: x-auth-token
 *          description: The user session token to update information
 *          type: string
 *          required: true
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          fullName:
 *                              type: string
 *                              example: "John Doe"
 *                          phoneNumber:
 *                              type: string
 *                              example: "8811223344"
 *                          profileImg:
 *                              type: string
 *                              format: binary
 *      responses:
 *          200:
 *              description: Successful response
 *          400:
 *              description: Information provided invalid
 *          403:
 *              description: Header session token invalid
 *          500:
 *              description: Server error
 */
router.put("/user", auth, userController.updateUser)

/* Endpoint for Update an existing user password */
/**
 * @swagger
 * /api/user-update-password:
 *  patch:
 *      summary: Update user password
 *      tags:
 *          - User
 *      description: Update an existing user password application
 *      parameters:
 *        - in: header
 *          name: x-auth-token
 *          description: The user session token to update password
 *          type: string
 *          required: true
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          newPassword:
 *                              type: string
 *                              example: "abc1234"
 *                          newRepeatPassword:
 *                              type: string
 *                              example: "abc1234"
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/SessionToken'
 *          400:
 *              description: Information provided invalid / Passwords provided does not have same value
 *          403:
 *              description: Header session token invalid
 *          500:
 *              description: Server error
 */
router.patch("/user-update-password", auth, userController.updateUserPassword)

/* Endpoint for Delete an existing user, their receipts and token information */
/**
 * @swagger
 * /api/user:
 *  delete:
 *      summary: Delete an user
 *      tags:
 *          - User
 *      description: Delete an user and all its information related
 *      parameters:
 *        - in: header
 *          name: x-auth-token
 *          description: The user session token to delete
 *          type: string
 *          required: true
 *      responses:
 *          200:
 *              description: Successful response
 *          403:
 *              description: Header session token invalid
 *          500:
 *              description: Server error
 */
router.delete("/user", auth, userController.deleteUser)

export default router
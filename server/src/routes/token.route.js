import express from "express"
const router = express.Router()
import { auth } from "../middlewares"
import { TokenController } from "../controllers"

const tokenController = new TokenController()

/**
 * @swagger
 * components:
 *  schemas:
 *      SessionToken:
 *          type: object
 *          properties:
 *              data:
 *                  type: string
 *                  description: The user session token
 *                  example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJ...
 * 
 */

/* Endpoint for log in an user session */
/**
 * @swagger
 * /api/log-in:
 *  post:
 *      summary: Create a new user session token
 *      tags:
 *          - LogIn
 *      description: Return a new user session token for all endpoints
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          email:
 *                              type: string
 *                              example: "mfernandez@email.com"
 *                          password:
 *                              type: string
 *                              example: "abc1234"
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          items:
 *                              $ref: '#/components/schemas/SessionToken'
 *          400:
 *              description: Bad request - Email or password not provided / Email or password invalid
 */
router.post("/log-in", tokenController.sessionLogIn)

/* Endpoint for refresh an user session token */
router.post("/refresh-token", tokenController.refreshToken)

/* Endpoint for sign out an user session */
router.post("/sign-out", auth, tokenController.sessionSignOut)

export default router
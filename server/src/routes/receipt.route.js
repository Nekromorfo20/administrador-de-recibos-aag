import express from "express"
const router = express.Router()
import { auth } from "../middlewares"
import { ReceiptController } from "../controllers"

const receiptController = new ReceiptController()

/**
 * @swagger
 *  components:
 *      schemas:
 *          Receipt:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      description: The receipt ID
 *                      example: 1
 *                  userId:
 *                      type: string
 *                      description: The user Id who create receipt
 *                      example: "1ede4103-d8fa-478a-87ce-ed0c2c9ac005"
 *                  provider:
 *                      type: string
 *                      description: The name of business provider
 *                      example: "USA Farmacy"
 *                  title:
 *                      type: string
 *                      description: Name of receipt or buy
 *                      example: "Suplements"
 *                  receiptType:
 *                      type: string
 *                      description: Type of receipt or buy
 *                      example: "Health"
 *                  comments:
 *                      type: string
 *                      description: Additional comments of receipt
 *                      example: "Buying of suplements"
 *                  amount:
 *                      type: number
 *                      description: Quantity of receipt or buy
 *                      example: 100.50
 *                  badge:
 *                      type: string
 *                      description: Type of coin used
 *                      example: USD
 *                  receiptDate:
 *                      type: date
 *                      description: Date of receipt or buy
 *                      example: 2024-05-15 00:00:00
 *                  receiptImg:
 *                      type: string
 *                      description: The url of receipt image uploaded in AWS
 *                      example: "https://receipt-administrator.s3.us-east-2.amazonaws.com/receipt/receipt-img.png"
 */

/* Endpoint for Get all receipts */
/**
 * @swagger
 * /api/receipts:
 *  get:
 *      summary: Get all user receipts
 *      tags:
 *          - Receipt
 *      description: Return all receipts created by user
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
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Receipt'
 *          403:
 *              description: Header session token invalid
 *          500:
 *              description: Server error
 */
router.get("/receipts", auth, receiptController.getReceipts)

/* Endpoint for Get a receipt by id */
/**
 * @swagger
 * /api/receipt:
 *  get:
 *      summary: Get a receipt by id
 *      tags:
 *          - Receipt
 *      description: Return a receipt search by id
 *      parameters:
 *        - in: header
 *          name: x-auth-token
 *          description: The user session token
 *          type: string
 *          required: true
 *        - in: query
 *          name: id
 *          description: The id of receipt to get information
 *          type: number
 *          required: true
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Receipt'
 *          400:
 *              description: Id receipt not provided or invalid
 *          403:
 *              description: Header session token invalid
 *          404:
 *              description: Receipt not found with id provided
 *          500:
 *              description: Server error
 */
router.get("/receipt", auth, receiptController.getReceipt)

/* Endpoint for Create a new receipt */
/**
 * @swagger
 * /api/receipt:
 *  post:
 *      summary: Create a new receipt
 *      tags:
 *          - Receipt
 *      description: Create a new receipt related an user
 *      parameters:
 *        - in: header
 *          name: x-auth-token
 *          description: The user session token
 *          type: string
 *          required: true
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          provider:
 *                              type: string
 *                              example: "USA Farmacy"
 *                          title:
 *                              type: string
 *                              example: "Suplements"
 *                          receiptType:
 *                              type: string
 *                              example: "Health"
 *                          comments:
 *                              type: string
 *                              example: "Buying of suplements"
 *                          amount:
 *                              type: number
 *                              example: 100.50
 *                          badge:
 *                              type: string
 *                              example: "USD"
 *                          receiptDate:
 *                              type: date
 *                              example: 2024-05-15 00:00:00
 *                          receiptImg:
 *                              type: string
 *                              format: binary
 *      responses:
 *          201:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Receipt'
 *          400:
 *              description: Information provided invalid / The amount cannot be less than 0
 *          403:
 *              description: Header session token invalid
 *          500:
 *              description: Server error
 */
router.post("/receipt", auth, receiptController.createReceipt)

/* Endpoint for Update an existing receipt */
/**
 * @swagger
 * /api/receipt:
 *  put:
 *      summary: Update an existing receipt
 *      tags:
 *          - Receipt
 *      description: Update an existing receipt of user by id
 *      parameters:
 *        - in: header
 *          name: x-auth-token
 *          description: The user session token
 *          type: string
 *          required: true
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 *                              example: 1
 *                          provider:
 *                              type: string
 *                              example: "USA Farmacy"
 *                          title:
 *                              type: string
 *                              example: "Suplements"
 *                          receiptType:
 *                              type: string
 *                              example: "Health"
 *                          comments:
 *                              type: string
 *                              example: "Buying of suplements"
 *                          amount:
 *                              type: number
 *                              example: 100.50
 *                          badge:
 *                              type: string
 *                              example: "USD"
 *                          receiptDate:
 *                              type: date
 *                              example: 2024-05-15 00:00:00
 *                          receiptImg:
 *                              type: string
 *                              format: binary
 *      responses:
 *          200:
 *              description: Successful response
 *          400:
 *              description: Information provided invalid / The amount cannot be less than 0
 *          403:
 *              description: Header session token invalid
 *          404:
 *              description: Receipt not found with id provided
 *          500:
 *              description: Server error
 */
router.put("/receipt", auth, receiptController.updatedReceipt)

/* Endpoint for Delete an existing receipt */
/**
 * @swagger
 * /api/receipt:
 *  delete:
 *      summary: Delete an receipt
 *      tags:
 *          - Receipt
 *      description: Delete an existing receipt of user by id
 *      parameters:
 *        - in: header
 *          name: x-auth-token
 *          description: The user session token
 *          type: string
 *          required: true
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          id:
 *                              type: integer
 *                              example: 1
 *      responses:
 *          200:
 *              description: Successful response
 *          400:
 *              description: Id receipt not provided or invalid
 *          404:
 *              description: Receipt not found with id provided
 *          403:
 *              description: Header session token invalid
 *          500:
 *              description: Server error
 */
router.delete("/receipt", auth, receiptController.deleteReceipt)

export default router
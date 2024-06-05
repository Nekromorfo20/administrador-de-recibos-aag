import express from "express"
const router = express.Router()
import { auth } from "../middlewares"
import { ReceiptController } from "../controllers"

const receiptController = new ReceiptController()

/* Endpoint for Get all receipts */
router.get("/receipts", auth, receiptController.getReceipts)

/* Endpoint for Get a receipt by id */
router.get("/receipt", auth, receiptController.getReceipt)

/* Endpoint for Create a new receipt */
router.post("/receipt", auth, receiptController.createReceipt)

/* Endpoint for Update an existing receipt */
router.put("/receipt", auth, receiptController.updatedReceipt)

/* Endpoint for Delete an existing receipt */
router.delete("/receipt", auth, receiptController.deleteReceipt)

export default router
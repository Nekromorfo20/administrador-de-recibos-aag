import request from "supertest"
import server from "../server"

let TOKEN_TEST = ""
let NEW_RECEIPT_ID = 0

describe("Create session token for 'receipt.test'", () => {
    it("Creating token...", async () => {
        const response = await request(server).post("/api/log-in")
            .send({
                email: "mfernandez@email.com",
                password: "abc1234"
            })

        TOKEN_TEST = response.body.data
    })
})

describe("POST /api/receipt", () => {
    it("Should display validation error: Token not provided", async () => {
        const response = await request(server).post("/api/receipt")
            .set('x-auth-token', '')
        expect(response.status).toBe(403)
        expect(response.body.message).toBe("¡Token not found!")
    })

    it("Should display validation errors", async () => {
        const response = await request(server).post("/api/receipt")
            .set('x-auth-token', `${TOKEN_TEST}`)
            .field("provider", "Wallmark$%")
            .field("title", "Mouse$%")
            .field("receiptType", "Equipo de trabajo$%")
            .field("comments", "Compro un mouse para computadora$%")
            .field("amount", 1000.50)
            .field("badge", "MXN3#")
            .field("receiptDate", "2024-06-16 00:00:00")
            .attach("receiptImg", `${__dirname}/../assets/mouse.png`)
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Error: The provider was not provided or does not have a valid format,Error: The title was not provided or does not have a valid format,Error: The receiptType does not have a valid format,Error: The comments does not have a valid format,Error: The badge does not have a valid format (MXN, USD, EUR)")
    })

    it("Should display error: Amount cannot be less than 0", async () => {
        const response = await request(server).post("/api/receipt")
            .set('x-auth-token', `${TOKEN_TEST}`)
            .field("provider", "Wallmark")
            .field("title", "Mouse")
            .field("receiptType", "Equipo de trabajo")
            .field("comments", "Compro un mouse para computadora")
            .field("amount", -1)
            .field("badge", "MXN")
            .field("receiptDate", "2024-06-16 00:00:00")
            .attach("receiptImg", `${__dirname}/../assets/mouse.png`)
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("¡The amount cannot be less than 0!")
    })

    it("Should create a new receipt", async () => {
        const response = await request(server).post("/api/receipt")
            .set('x-auth-token', `${TOKEN_TEST}`)
            .field("provider", "Wallmark")
            .field("title", "Mouse")
            .field("receiptType", "Equipo de trabajo")
            .field("comments", "Compro un mouse para computadora")
            .field("amount", 1000.50)
            .field("badge", "MXN")
            .field("receiptDate", "2024-06-16 00:00:00")
            .attach("receiptImg", `${__dirname}/../assets/mouse.png`)
        expect(response.status).toBe(201)
        expect(response.body.message).toBe("¡Receipt created successfully!")
        expect(response.body.data).toHaveProperty("id")
        expect(response.body.data).toHaveProperty("userId")

        NEW_RECEIPT_ID = response.body.data.id
    })
})

describe("GET /api/receipts", () => {
    it("Should display validation error: Token not provided", async () => {
        const response = await request(server).get("/api/receipts")
            .set('x-auth-token', '')
        expect(response.status).toBe(403)
        expect(response.body.message).toBe("¡Token not found!")
    })

    it("Should display receipts created by user", async () => {
        const response = await request(server).get("/api/receipts")
            .set('x-auth-token', `${TOKEN_TEST}`)
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("¡OK!")
    })
})

describe("GET /api/receipt", () => {
    it("Should display validation error: Token not provided", async () => {
        const response = await request(server).get("/api/receipt")
            .set('x-auth-token', '')
        expect(response.status).toBe(403)
        expect(response.body.message).toBe("¡Token not found!")
    })

    it("Should display error: You must provide id", async () => {
        const response = await request(server).get("/api/receipt")
            .set('x-auth-token', `${TOKEN_TEST}`)
            .query({})
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("¡You must provide the id for search a receipt!")
    })

    it("Should display error: Could not found receipt", async () => {
        const response = await request(server).get("/api/receipt")
            .set('x-auth-token', `${TOKEN_TEST}`)
            .query({
                id: 0
            })
        expect(response.status).toBe(404)
        expect(response.body.message).toBe("¡Could not found the receipt with id provided!")
    })

    it("Should get an existing receipt", async () => {
        const response = await request(server).get("/api/receipt")
            .set('x-auth-token', `${TOKEN_TEST}`)
            .query({
                id: NEW_RECEIPT_ID
            })
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("¡OK!")
        expect(response.body.data).toHaveProperty("id")
        expect(response.body.data).toHaveProperty("userId")
    })
})

describe("PUT /api/receipt", () => {
    it("Should display validation error: Token not provided", async () => {
        const response = await request(server).put("/api/receipt")
            .set('x-auth-token', '')
        expect(response.status).toBe(403)
        expect(response.body.message).toBe("¡Token not found!")
    })

    it("Should display validation errors", async () => {
        const response = await request(server).put("/api/receipt")
            .set('x-auth-token', `${TOKEN_TEST}`)
            .field("id", NEW_RECEIPT_ID)
            .field("provider", "Wallmark$%")
            .field("title", "Mouse$%")
            .field("receiptType", "Equipo de trabajo$%")
            .field("comments", "Compro un mouse para computadora$%")
            .field("amount", 1000.50)
            .field("badge", "MXN3#")
            .field("receiptDate", "2024-06-16 00:00:00")
            .attach("receiptImg", `${__dirname}/../assets/mouse.png`)
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Error: The provider was not provided or does not have a valid format,Error: The title was not provided or does not have a valid format,Error: The receiptType does not have a valid format,Error: The comments does not have a valid format,Error: The badge does not have a valid format (MXN, USD, EUR)")
    })

    it("Should display error: Amount cannot be less than 0", async () => {
        const response = await request(server).put("/api/receipt")
            .set('x-auth-token', `${TOKEN_TEST}`)
            .field("id", NEW_RECEIPT_ID)
            .field("provider", "Wallmark")
            .field("title", "Mouse")
            .field("receiptType", "Equipo de trabajo")
            .field("comments", "Compro un mouse para computadora")
            .field("amount", -1)
            .field("badge", "MXN")
            .field("receiptDate", "2024-06-16 00:00:00")
            .attach("receiptImg", `${__dirname}/../assets/mouse.png`)
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("¡The amount cannot be less than 0!")
    })

    it("Should update an existing receipt", async () => {
        const response = await request(server).put("/api/receipt")
            .set('x-auth-token', `${TOKEN_TEST}`)
            .field("id", NEW_RECEIPT_ID)
            .field("provider", "Wallmark E")
            .field("title", "Mouse E")
            .field("receiptType", "Equipo de trabajo E")
            .field("comments", "Compro un mouse para computadora E")
            .field("amount", 101.50)
            .field("badge", "MXN")
            .field("receiptDate", "2024-06-16 00:00:00")
            .attach("receiptImg", `${__dirname}/../assets/mouse.png`)
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("¡Receipt update successfully!")
    })
})

describe("DELETE /api/receipt", () => {
    it("Should display validation error: Token not provided", async () => {
        const response = await request(server).delete("/api/receipt")
            .set('x-auth-token', '')
        expect(response.status).toBe(403)
        expect(response.body.message).toBe("¡Token not found!")
    })

    it("Should display error: You must provide id", async () => {
        const response = await request(server).delete("/api/receipt")
            .set('x-auth-token', `${TOKEN_TEST}`)
            .query({})
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("¡You must provide the id for delete a receipt!")
    })

    it("Should display error: Could not found the receipt", async () => {
        const response = await request(server).delete("/api/receipt")
            .set('x-auth-token', `${TOKEN_TEST}`)
            .query({
                id: 0
            })
        expect(response.status).toBe(404)
        expect(response.body.message).toBe("¡Could not found the receipt with id provided!")
    })

    it("Should delete an existing receipt", async () => {
        const response = await request(server).delete("/api/receipt")
            .set('x-auth-token', `${TOKEN_TEST}`)
            .query({
                id: NEW_RECEIPT_ID
            })
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("¡Receipt delete successfully!")
    })
})
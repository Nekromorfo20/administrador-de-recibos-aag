import request from "supertest"
import server from "../server"

let TOKEN_TEST = ""
let NEW_TOKEN_TEST = ""

describe("POST /api/user", () => {
    it("Should display validation errors", async () => {
        const response = await request(server).post("/api/user")
            .field("fullName", "$pedro!")
            .field("email", "$pedro1!@gmail.com")
            .field("password", "admin123$%&")
            .field("phoneNumber", "811934567")
            .attach("profileImg", `${__dirname}/../assets/duck.png`)
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Error: The fullName was not provided or does not have a valid format,Error: The email was not provided or does not have a valid format,Error: The password was not provided or does not have a valid format")
    })

    it("Should display error: Email already register", async () => {
        const response = await request(server).post("/api/user")
            .field("fullName", "Pedro")
            .field("email", "mfernandez@email.com")
            .field("password", "admin123")
            .field("phoneNumber", "811934567")
            .attach("profileImg", `${__dirname}/../assets/duck.png`)
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("¡The email provided is already register!")
    })

    it("Should create a new user", async () => {
        const response = await request(server).post("/api/user")
            .field("fullName", "Pedro")
            .field("email", "pedro1@gmail.com")
            .field("password", "admin123")
            .field("phoneNumber", "811934567")
            .attach("profileImg", `${__dirname}/../assets/duck.png`)
        expect(response.status).toBe(201)
        expect(response.body.message).toBe("¡User created successfully!")
    })
})

describe("Create session token for 'user.test'", () => {
    it("Creating token...", async () => {
        const response = await request(server).post("/api/log-in")
            .send({
                email: "pedro1@gmail.com",
                password: "admin123"
            })

        TOKEN_TEST = response.body.data
    })
})

describe("GET /api/user", () => {
    it("Should display middleware error: Token not found", async () => {
        const response = await request(server).get("/api/user")
            .set('x-auth-token', '')
        expect(response.status).toBe(403)
        expect(response.body.message).toBe("¡Token not found!")
    })

    it("Should display user information", async () => {
        const response = await request(server).get("/api/user")
            .set('x-auth-token', `${TOKEN_TEST}`)
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("¡OK!")
        expect(response.body.data).toHaveProperty("id")
        expect(response.body.data).toHaveProperty("email")
    })
})

describe("PUT /api/user", () => {
    it("Should display middleware error: Token not found", async () => {
        const response = await request(server).put("/api/user")
            .set('x-auth-token', '')
        expect(response.status).toBe(403)
        expect(response.body.message).toBe("¡Token not found!")
    })

    it("Should display validation errors", async () => {
        const response = await request(server).put("/api/user")
            .set('x-auth-token', `${TOKEN_TEST}`)
            .field("fullName", "$pedro!")
            .field("phoneNumber", "811934567AE$")
            .attach("profileImg", `${__dirname}/../assets/duck.png`)
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Error: The fullName was not provided or does not have a valid format,Error: The phoneNumber does not have a valid format")
    })

    it("Should updated user information", async () => {
        const response = await request(server).put("/api/user")
            .set('x-auth-token', `${TOKEN_TEST}`)
            .field("fullName", "Pedro")
            .field("phoneNumber", "811934567")
            .attach("profileImg", `${__dirname}/../assets/duck.png`)
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("¡User update successfully!")
    })
})

describe("PUT /api/user-update-password", () => {
    it("Should display middleware error: Token not found", async () => {
        const response = await request(server).patch("/api/user-update-password")
            .set('x-auth-token', '')
        expect(response.status).toBe(403)
        expect(response.body.message).toBe("¡Token not found!")
    })

    it("Should display validation errors", async () => {
        const response = await request(server).patch("/api/user-update-password")
            .set('x-auth-token', `${TOKEN_TEST}`)
            .field("newPassword", "%admin123$")
            .field("newRepeatPassword", "%admin123$")
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Error: The password was not provided or does not have a valid format")
    })

    it("Should display error: Passwords are not the same", async () => {
        const response = await request(server).patch("/api/user-update-password")
            .set('x-auth-token', `${TOKEN_TEST}`)
            .field("newPassword", "admin123")
            .field("newRepeatPassword", "admin124")
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("¡The passwords provided does not have the same value!")
    })

    it("Should update user password", async () => {
        const response = await request(server).patch("/api/user-update-password")
            .set('x-auth-token', `${TOKEN_TEST}`)
            .field("newPassword", "admin123")
            .field("newRepeatPassword", "admin123")
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("¡User password update successfully!")

        NEW_TOKEN_TEST = response.body.data
    })
})

describe("DELETE /api/user", () => {
    it("Should display middleware error: Token not found", async () => {
        const response = await request(server).delete("/api/user")
            .set('x-auth-token', '')
        expect(response.status).toBe(403)
        expect(response.body.message).toBe("¡Token not found!")
    })

    it("Should delete user", async () => {
        const response = await request(server).delete("/api/user")
            .set('x-auth-token', `${NEW_TOKEN_TEST}`)
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("¡User and their receipts delete successfully!")
    })
})
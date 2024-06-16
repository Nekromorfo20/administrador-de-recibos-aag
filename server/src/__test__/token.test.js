import request from "supertest"
import server from "../server"

let TOKEN_TEST = ""

describe("POST /api/log-in", () => {
    it("Should display validation errors", async () => {
        const response = await request(server).post("/api/log-in")
            .send({})
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Error: The email was not provided or does not have a valid format,Error: The password was not provided or does not have a valid format")
    })

    it("Should display error: Email or password invalid", async () => {
        const response = await request(server).post("/api/log-in")
            .send({
                email: "mfernandez@email.com",
                password: "XXX"
            })
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("¡Email or password invalid!")
    })

    it("Should create a user session token", async () => {
        const response = await request(server).post("/api/log-in")
            .send({
                email: "mfernandez@email.com",
                password: "abc1234"
            })
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("¡OK!")

        TOKEN_TEST = response.body.data
    })
})

describe("POST /api/refresh-token", () => {
    it("Should display validation error: Token not provided", async () => {
        const response = await request(server).post("/api/refresh-token")
            .set('x-auth-token', '')
        expect(response.status).toBe(404)
        expect(response.body.message).toBe("¡Refresh token not provided!")
    })

    it("Should refresh a session token valid", async () => {
        const response = await request(server).post("/api/refresh-token")
            .send({
                token: TOKEN_TEST
            })
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("¡OK!")
    })
})

describe("POST /api/sign-out", () => {
    it("Should display middleware error: Token not found", async () => {
        const response = await request(server).post("/api/sign-out")
            .set('x-auth-token', '')
        expect(response.status).toBe(403)
        expect(response.body.message).toBe("¡Token not found!")
    })

    it("Should display middleware error: Token not found", async () => {
        const response = await request(server).post("/api/sign-out")
            .set('x-auth-token', `${TOKEN_TEST}`)
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("¡Session close successfully!")
    })
})
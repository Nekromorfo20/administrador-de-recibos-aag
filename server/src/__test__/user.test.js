import request from "supertest"
import server from "../server"

describe("POST /api/user", () => {
    it("Should create a new user", async () => {
        const response = await request(server).post("/api/user")
            .field("fullName", "Pedro")
            .field("email", "pedro1@gmail.com")
            .field("password", "admin123")
            .field("phoneNumber", "811934567")
            .attach("profileImg", `${__dirname}/../assets/duck.png`)
        expect(response.status).toBe(200)
    })
})
import request from "supertest"
import server from "../server"

describe("POST /api/log-in", () => {
    it("Should create a user session token", async () => {
        const response = await request(server).post("/api/log-in").send({
            email: "pedro@gmail.com",
            password: "admin123"
        })
        expect(response.status).toBe(200)
        expect(response.body.message).toBe("¡OK!")
    })

    it("Should display validation errors", async () => {
        const response = await request(server).post("/api/log-in").send({})
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("Error: The email was not provided or does not have a valid format,Error: The password was not provided or does not have a valid format")
    })

    it("Should wrong email or password", async () => {
        const response = await request(server).post("/api/log-in").send({
            email: "pedro@gmail.com",
            password: "XXX"
        })
        expect(response.status).toBe(400)
        expect(response.body.message).toBe("¡Email or password invalid!")
    })
})

// describe("POST /api/refresh-token", () => {
//     it("Debe retornar un código 200", async () => {
//         const response = await request(server).post("/api/log-in").send({
//             email: "pedro@gmail.com",
//             password: "admin123"
//         })
//         expect(response.status).toBe(200)
//         expect(response.body.message).toBe("¡OK!")
//     })
// })
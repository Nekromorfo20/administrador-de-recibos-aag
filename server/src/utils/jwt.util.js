import jwt from "jsonwebtoken"

/**
* @author Alan Aguilar
* @description Function to generate a new JWT session
* @date 26-05-2024
* @return String
*/
export const generateNewToken = (userId, email) => {
    const ENV = process.env
    const payload = {
        user: {
            userId,
            email
        }
    }
    const token = jwt.sign(payload, ENV.API_TOKEN_SECRET, {
        expiresIn: Number(ENV.API_TOKEN_EXPIRATION),
        algorithm: `${ENV.API_TOKEN_ALGORITHM}`
    })

    return token
}

/**
* @author Alan Aguilar
* @description Function to verify if a token is valid
* @date 26-05-2024
* @return Object
*/
export const checkToken = (token) => {
    const cypher = jwt.verify(token, process.env.API_TOKEN_SECRET)
    return cypher
}
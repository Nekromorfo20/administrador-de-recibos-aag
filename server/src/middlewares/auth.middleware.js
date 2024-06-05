import { TokenModel } from "../models"
import { responseUtil, checkToken } from "../utils"

/**
* @author Alan Aguilar
* @description Funtion middleware to validated a JWT in every HTTP request in API
* @date 26-05-2024
* @return Function
*/
export const auth = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token')
        if (!token) return res.status(403).json(responseUtil('¡Token not found!', {}))

        const cypher = checkToken(token)

        const userTokenExist = await TokenModel.findOne({ where: { userId: cypher.user.userId } })
        if (!userTokenExist || userTokenExist.token !== token) return res.status(403).json(responseUtil('¡Invalid token!', {}))

        req.user = cypher.user
        next()
    } catch (error) {
        return res.status(403).json(responseUtil('¡Invalid token!', {}))
    }
}
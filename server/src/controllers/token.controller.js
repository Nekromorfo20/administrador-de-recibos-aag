import sequelize from "../configs/connectionDB"
import { TokenModel, UserModel } from "../models"
import { UserValidator } from "../validators"
import { responseUtil, validatePassword, generateNewToken, checkToken } from "../utils"

class TokenController {

    /**
    * @author Alan Aguilar
    * @description Method for log in and create an user session token 
    * @date 25-05-2024
    * @return Object
    * @memberof TokenController
    */
    async sessionLogIn (req, res) {
        const { email, password } = req.body

        const valid = UserValidator.validate({ fullName: "A", email, password })
        if (valid.length > 0) return res.status(400).json(responseUtil(valid.toString(), {}))

        const trans = await sequelize.transaction()

        try {

            const userExist = await UserModel.findOne({ where: { email } })
            if (!userExist) return res.status(400).json(responseUtil('¡Email or password invalid!', {}))

            const validPassword = await validatePassword(password, userExist.password)
            if (!validPassword) return res.status(400).json(responseUtil('¡Email or password invalid!', {}))

            const newToken = generateNewToken(userExist.id, userExist.email)

            const userTokenExist = await TokenModel.findOne({ where: { userId: userExist.id } })
            if (userTokenExist) {
                await TokenModel.update({
                    token: newToken,
                    updatedDate: new Date()
                }, { where: { userId: userExist.id }, transaction: trans })
            } else {
                await TokenModel.create({
                    userId: userExist.id,
                    token: newToken
                }, { transaction: trans })
            }

            await trans.commit()
            return res.status(200).json(responseUtil('¡OK!', newToken))
        } catch (error) {
            console.log(error)
            await trans.rollback()
            return res.status(500).json(responseUtil('¡Server error!', {}))
        }
    }

    /**
    * @author Alan Aguilar
    * @description Method for refresh a session token
    * @date 25-05-2024
    * @return Object
    * @memberof TokenController
    */
    async refreshToken (req, res) {
        const { token } = req.body

        if (!token) return res.status(400).json(responseUtil('¡Refresh token not provided!', {}))

        const trans = await sequelize.transaction()

        try {
            const infoToken = checkToken(token)

            const tokenExist = await TokenModel.findOne({ where: { userId: infoToken.user.userId } })
            if (!tokenExist || token !== tokenExist.token) return res.status(403).json(responseUtil('¡Could not updated the session token!', {}))

            const newToken = generateNewToken(tokenExist.userId, infoToken.user.email)

            await TokenModel.update({
                token: newToken,
                updatedDate: new Date()
            }, { where: { userId: tokenExist.userId }, transaction: trans })

            await trans.commit()
            return res.status(200).json(responseUtil('¡OK!', newToken))
        } catch (error) {
            console.log(error)
            await trans.rollback()
            return res.status(500).json(responseUtil('¡Server error!', {}))
        }
    }

    /**
    * @author Alan Aguilar
    * @description Method for sign out user session and clear token
    * @date 26-05-2024
    * @return Object
    * @memberof TokenController
    */
    async sessionSignOut (req, res) {
        const { userId } = req.user

        const trans = await sequelize.transaction()

        try {

            const tokenExist = await TokenModel.findOne({ where: { userId } })

            await TokenModel.update({
                token: "",
                updatedDate: new Date()
            }, { where: { userId: tokenExist.userId }, transaction: trans })

            await trans.commit()
            return res.status(200).json(responseUtil('¡Session close successfully!', {}))
        } catch (error) {
            console.log(error)
            await trans.rollback()
            return res.status(500).json(responseUtil('¡Server error!', {}))
        }
    }
}

export default TokenController
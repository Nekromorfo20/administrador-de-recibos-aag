import sequelize from "../configs/connectionDB"
import { UserModel, TokenModel } from "../models"
import { responseUtil } from "../utils"
import { UserValidator } from "../validators"
import { encryptPassword, AWSUtil, generateRandomImageName } from "../utils"

class UserController {

    /**
    * @author Alan Aguilar
    * @description Method for obtain a user by id
    * @date 25-05-2024
    * @return Object
    * @memberof UserController
    */
    async getUser (req, res) {
       const { userId } = req.user

        try {
            let user = await UserModel.findByPk(userId, {
                attributes: { exclude:["password", "createdDate", "updatedDate"] }
            })
            if (!user) return res.status(404).json(responseUtil('¡Could not found the user!', {}))

                user.profileImg = user.profileImg !== "" ? `${process.env.AWS_S3_BUCKET_URL}/${user.profileImg}` : user.profileImg

            return res.status(200).json(responseUtil('¡OK!', user))
        } catch (error) {
            console.log(error)
            return res.status(500).json(responseUtil('¡Server error!', {}))
        }
    }

    /**
    * @author Alan Aguilar
    * @description Method for create a new user
    * @date 25-05-2024
    * @return Object
    * @memberof UserController
    */
    async createUser (req, res) {
        const { fullName, email, password, phoneNumber  } = req.body
    
        const valid = UserValidator.validate({ fullName, email, password, phoneNumber })
        if (valid.length > 0) return res.status(400).json(responseUtil(valid.toString(), {}))

        let pathAWS = ""
        const trans = await sequelize.transaction()
        const awsUtil = new AWSUtil()

        try {
            const emailExist = await UserModel.findOne({ where: { email } })
            if (emailExist) return res.status(400).json(responseUtil('¡The email provided is already register!', {}))

            const passwordEncrypt = await encryptPassword(password)

            if (req.files) {
                const { profileImg } = req.files
                pathAWS = `${process.env.AWS_S3_BUCKET_PROFILE}/${generateRandomImageName(profileImg.name)}`
                const uploadFile = await awsUtil.uploadeBucketObject(pathAWS, profileImg.data)
                if (!uploadFile || !uploadFile.fileObject) throw new Error("¡The file cannot be uploaded in AWS!")
            }

            await UserModel.create({
                fullName,
                email,
                password: passwordEncrypt,
                phoneNumber,
                profileImg: pathAWS,
            }, { transaction: trans })

            await trans.commit()
            return res.status(200).json(responseUtil('¡User created successfully!', {}))
        } catch (error) {
            console.log(error)
            await trans.rollback()
            return res.status(500).json(responseUtil('¡Server error!', {}))
        }
    }

    /**
    * @author Alan Aguilar
    * @description Method for updated a existing user
    * @date 25-05-2024
    * @return Object
    * @memberof UserController
    */
    async updateUser (req, res) {
        const { userId } = req.user
        const { fullName, phoneNumber } = req.body
    
        const valid = UserValidator.validate({ email: "email@email.com", password: "A", fullName, phoneNumber })
        if (valid.length > 0) return res.status(400).json(responseUtil(valid.toString(), {}))

        let pathAWS = ""
        const trans = await sequelize.transaction()
        const awsUtil = new AWSUtil()

        try {
            const userExist = await UserModel.findByPk(userId)

            if (req.files) {
                const { profileImg } = req.files
                pathAWS = `${process.env.AWS_S3_BUCKET_PROFILE}/${generateRandomImageName(profileImg.name)}`
                const uploadFile = await awsUtil.uploadeBucketObject(pathAWS, profileImg.data)
                if (!uploadFile || !uploadFile.fileObject) throw new Error("¡The file cannot be uploaded in AWS!")

                if (userExist.profileImg !== "") await awsUtil.deleteBucketObject(userExist.profileImg)
            }

            await UserModel.update({
                fullName,
                phoneNumber,
                profileImg: pathAWS,
                updatedDate: new Date()
            }, { where: { id: userExist.id }, transaction: trans })

            await trans.commit()
            return res.status(200).json(responseUtil('¡User update successfully!', {}))
        } catch (error) {
            console.log(error)
            await trans.rollback()
            return res.status(500).json(responseUtil('¡Server error!', {}))
        }
    }

    /**
    * @author Alan Aguilar
    * @description Method for updated an user password
    * @date 25-05-2024
    * @return Object
    * @memberof UserController
    */
    async updateUserPassword (req, res) {
        const { userId } = req.user
        const { newPassword, newRepeatPassword } = req.body

        const valid = UserValidator.validate({ email: "email@email.com", password: newPassword, fullName: "A" })
        if (valid.length > 0) return res.status(400).json(responseUtil(valid.toString(), {}))

        if(newPassword !== newRepeatPassword) return res.status(400).json(responseUtil('¡The passwords provided does not have the same value!', {}))

        const trans = await sequelize.transaction()

        try {
            const userExist = await UserModel.findByPk(userId)

            const newPasswordEncrypt = await encryptPassword(newPassword)

            await UserModel.update({
                password: newPasswordEncrypt,
                updatedDate: new Date()
            }, { where: { id: userExist.id }, transaction: trans })

            const newToken = generateNewToken(userExist.id, userExist.email)

            await TokenModel.update({
                token: newToken,
                updatedDate: new Date()
            }, { where: { userId: userExist.id }, transaction: trans })

            await trans.commit()
            return res.status(200).json(responseUtil('¡User password update successfully!', newToken))
        } catch (error) {
            console.log(error)
            await trans.rollback()
            return res.status(500).json(responseUtil('¡Server error!', {}))
        }
    }
}

export default UserController
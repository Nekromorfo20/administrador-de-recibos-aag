import sequelize from "../configs/connectionDB"
import { ReceiptModel } from "../models"
import { responseUtil, AWSUtil, generateRandomImageName } from "../utils"
import { ReceiptValidator } from "../validators"

class ReceiptController {

    /**
    * @author Alan Aguilar
    * @description Method for obtain all receipts
    * @date 21-05-2024
    * @return Object
    * @memberof ReceiptController
    */
    async getReceipts (req, res) {
        const { userId } = req.user

        try {
            const receipts = await ReceiptModel.findAll({
                where: { userId },
                order: [["createdDate", "DESC"]],
                attributes: { exclude:["createdDate", "updatedDate"] }
            })
            const results = receipts.map(receipt => ({...receipt.dataValues, receiptImg: receipt.receiptImg !== "" ? `${process.env.AWS_S3_BUCKET_URL}/${receipt.receiptImg}` : receipt.receiptImg }))

            return res.status(200).json(responseUtil('¡OK!', results))
        } catch (error) {
            console.log(error)
            return res.status(500).json(responseUtil('¡Server error!', {}))
        }
    }

    /**
    * @author Alan Aguilar
    * @description Method for obtain a receipts by id
    * @date 21-05-2024
    * @return Object
    * @memberof ReceiptController
    */
    async getReceipt (req, res) {
       const { userId } = req.user
       const { id } = req.query

       if (!id) return res.status(400).json(responseUtil('¡You must provide the id for search a receipt!', {}))

        try {

            let receipt = await ReceiptModel.findOne({
                where: { userId, id },
                attributes: { exclude:["createdDate", "updatedDate"] }
            })
            if (!receipt) return res.status(404).json(responseUtil('¡Could not found the receipt with id provided!', {}))

            receipt.receiptImg = receipt.receiptImg !== "" ? `${process.env.AWS_S3_BUCKET_URL}/${receipt.receiptImg}` : receipt.receiptImg

            return res.status(200).json(responseUtil('¡OK!', receipt))
        } catch (error) {
            console.log(error)
            return res.status(500).json(responseUtil('¡Server error!', {}))
        }
    }

    /**
    * @author Alan Aguilar
    * @description Method for create a new receipt
    * @date 23-05-2024
    * @return Object
    * @memberof ReceiptController
    */
    async createReceipt (req, res) {
       const { userId } = req.user
       let { provider, title, receiptType, comments, amount, badge, receiptDate } = req.body

       amount = Number(amount)
       receiptDate = new Date(receiptDate)

       const valid = ReceiptValidator.validate({ userId, provider, title, receiptType, comments, amount, badge, receiptDate })    
       if (valid.length > 0) return res.status(400).json(responseUtil(valid.toString(), {}))
       if(amount < 0) return res.status(400).json(responseUtil('¡The amount cannot be less than 0!', {}))

       let pathAWS = ""
       const trans = await sequelize.transaction()
       const awsUtil = new AWSUtil()

       try {
            if (req.files) {
                const { receiptImg } = req.files
                pathAWS = `${process.env.AWS_S3_BUCKET_RECEIPT}/${userId}/${generateRandomImageName(receiptImg.name)}`
                const uploadFile = await awsUtil.uploadePublicBucketObject(pathAWS, receiptImg.data)
                if (!uploadFile || !uploadFile.fileObject) throw new Error("¡The file cannot be uploaded in AWS!")
            }

            await ReceiptModel.create({
                userId,
                provider,
                title,
                receiptType,
                comments,
                amount,
                badge,
                receiptDate,
                receiptImg: pathAWS
            }, { transaction: trans })

            await trans.commit()
            return res.status(200).json(responseUtil('¡Receipt created successfully!', {}))
        } catch (error) {
            console.log(error)
            await trans.rollback()
            if (pathAWS !== "") awsUtil.deleteBucketObject(pathAWS)
            return res.status(500).json(responseUtil('¡Server error!', {}))
        }
    }

    /**
    * @author Alan Aguilar
    * @description Method for updated an existing receipt
    * @date 25-05-2024
    * @return Object
    * @memberof ReceiptController
    */
    async updatedReceipt (req, res) {
        const { userId } = req.user
        let { id, provider, title, receiptType, comments, amount, badge, receiptDate } = req.body

        id = Number(id)
        amount = Number(amount)
        receiptDate = new Date(receiptDate)

        const valid = ReceiptValidator.validate({ id, userId, provider, title, receiptType, comments, amount, badge, receiptDate })    
        if (valid.length > 0) return res.status(400).json(responseUtil(valid.toString(), {}))
        if(amount < 0) return res.status(400).json(responseUtil('¡The amount cannot be less than 0!', {}))

        let pathAWS = ""
        const trans = await sequelize.transaction()
        const awsUtil = new AWSUtil()

        try {
            const receipt = await ReceiptModel.findOne({ where: { id, userId } })
            if (!receipt) return res.status(404).json(responseUtil('¡The receipt was not found!', {}))

            if (req.files) {
                const { receiptImg } = req.files
                pathAWS = `${process.env.AWS_S3_BUCKET_RECEIPT}/${userId}/${generateRandomImageName(receiptImg.name)}`
                const uploadFile = await awsUtil.uploadePublicBucketObject(pathAWS, receiptImg.data)
                if (!uploadFile || !uploadFile.fileObject) throw new Error("¡The file cannot be uploaded in AWS!")

                if (receipt.receiptImg !== "") await awsUtil.deleteBucketObject(receipt.receiptImg)
            }
    
            await ReceiptModel.update({
                provider,
                title,
                receiptType,
                comments,
                amount,
                badge,
                receiptDate,
                receiptImg: pathAWS,
                updatedDate: new Date()
            }, { where: { id: receipt.id }, transaction: trans })

            await trans.commit()
            return res.status(200).json(responseUtil('¡Receipt update successfully!', {}))
        } catch (error) {
            console.log(error)
            await trans.rollback()
            if (pathAWS !== "") awsUtil.deleteBucketObject(pathAWS)
            return res.status(500).json(responseUtil('¡Server error!', {}))
        }
    }

    /**
    * @author Alan Aguilar
    * @description Method for delete a receipt by id
    * @date 25-05-2024
    * @return Object
    * @memberof ReceiptController
    */
    async deleteReceipt (req, res) {
        const { userId } = req.user
        const { id } = req.query

        if (!id) return res.status(400).json(responseUtil('¡You must provide the id for delete a receipt!', {}))

        const trans = await sequelize.transaction()
        const awsUtil = new AWSUtil()

        try {
            const receipt = await ReceiptModel.findOne({ where: { userId, id } })
            if (!receipt) return res.status(404).json(responseUtil('¡Could not found the receipt with id provided!', {}))

            await ReceiptModel.destroy({ where: { id: receipt.id }, transaction: trans })

            if (receipt.receiptImg !== "") await awsUtil.deleteBucketObject(receipt.receiptImg)

            await trans.commit()
            return res.status(200).json(responseUtil('¡Receipt delete successfully!', {}))
        } catch (error) {
            console.log(error)
            await trans.rollback()
            return res.status(500).json(responseUtil('¡Server error!', {}))
        }
    }
}

export default ReceiptController
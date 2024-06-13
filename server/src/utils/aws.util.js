import aws from "aws-sdk"

class AWSUtil {
    constructor() {
        this.awss3 = new aws.S3({
            accessKeyId: process.env.AWS_S3_ACCESS_KEY,
            secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
        })
    }

    /**
    * @author Alan Aguilar
    * @description Method for updated a new public file in AWS
    * @date 27-05-2024
    * @return Object
    * @memberof AWSUtil
    */
    async uploadePublicBucketObject (filePathAWS, fileData) {
        const awsS3Parameters = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filePathAWS,
            Body: fileData,
            ACL: 'public-read'
        }
        let fileUploaded = {}
        try {
            let fileObject = await this.awss3.upload(awsS3Parameters).promise()
            fileUploaded = { fileObject, filePathAWS }
        } catch (e) {
            console.log(e)
            return false
        }
        return fileUploaded
    }

    /**
    * @author Alan Aguilar
    * @description Method for delete an existing file in AWS
    * @date 27-05-2024
    * @return Object
    * @memberof AWSUtil
    */
    async deleteBucketObject (filePathAWS) {
        if (filePathAWS === '' || filePathAWS === '/' || filePathAWS === null) {
            console.log('¡Cannot send a empty url!')
            return false
        }

        const awsS3Parameters = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filePathAWS
        }

        let awsObject = {}
        try {
            let fileObject = await this.awss3.deleteObject(awsS3Parameters).promise()
            awsObject = { fileObject, filePathAWS }
        } catch (e) {
            console.log(e)
            return false
        }
        return awsObject
    }

    /**
    * @author Alan Aguilar
    * @description Method for delete multiple existing files in AWS
    * @date 13-06-2024
    * @return Object
    * @memberof AWSUtil
    */
    async deleteBucketObjectsAndDir (filePathsAWS) {
        if (filePathsAWS.length < 1) {
            console.log('¡You must provided almost one object path!')
            return false
        }

        for (let i = 0; i < filePathsAWS.length; i++) {
            if (filePathsAWS[i] === '' || filePathsAWS[i] === '/' || filePathsAWS[i] === null) {
                console.log('¡Cannot send a empty url!')
                return false
            }
        }

        let pathObjects = []
        for (let i = 0; i < filePathsAWS.length; i++) {
            if (i === 0) {
                let arrDir = filePathsAWS[i].split("/")
                arrDir.pop()
                const pathDir = `${arrDir.join("/")}/`
                pathObjects.push({ Key: pathDir })
            }
            pathObjects.push({ Key: filePathsAWS[i] })
        }

        const awsS3Parameters = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Delete: {
                Objects: pathObjects,
            }
        }

        try {
            const fileObject = await this.awss3.deleteObjects(awsS3Parameters).promise()
            return fileObject
            return false
        } catch (e) {
            console.log(e)
            return false
        }
    }
}

export default AWSUtil
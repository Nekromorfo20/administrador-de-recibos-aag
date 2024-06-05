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
    * @description Method for updated a new file in AWS
    * @date 27-05-2024
    * @return Object
    * @memberof AWSUtil
    */
    async uploadeBucketObject (filePathAWS, fileData) {
        const awsS3Params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filePathAWS,
            Body: fileData
        }

        let fileUploaded = {}
        try {
            let fileObject = await this.awss3.putObject(awsS3Params).promise()
            fileUploaded = { fileObject, filePathAWS }
        } catch (e) {
            console.log(e)
            return false
        }

        return fileUploaded
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

        let fileDownloaded = {}
        try {
            let fileObject = await this.awss3.deleteObject(awsS3Parameters).promise()
            fileDownloaded = { fileObject, filePathAWS }
        } catch (e) {
            console.log(e)
            return false
        }
        return fileDownloaded
    }

    async getFilesInFolderBucketObject (folderPath) {
        const listParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Prefix: folderPath
        }
    
        let listedObjects = null
        try {
          listedObjects = await this.awss3.listObjectsV2(listParams).promise()
          if (listedObjects.Contents.length === 0) return false
          return listedObjects
        } catch (error) {
          console.log(error)
          return false
        }
      }
}

export default AWSUtil
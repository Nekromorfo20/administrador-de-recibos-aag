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
    * @description Method for delete a directoy image in AWS
    * @date 11-06-2024
    * @return Object
    * @memberof AWSUtil
    */
    async deleteBucketDirectory (dir) {
        if (dir === '' || dir === '/' || dir === null) {
            console.log('¡The url provided its empty or does not valid!')
            return false
        }

        const listParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Prefix: dir
        }

        try {
            const listedObjects = await this.awss3.listBuckets(listParams).promise()
            if (listedObjects.Contents.length === 0) {
                console.log('¡Could not found the directory to delete!')
                return true
            }

            const deleteParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Delete: { Objects: [] }
            }

            listedObjects.Contents.forEach((content) => {
                deleteParams.Delete.Objects.push({ Key: content.Key })
            })

            await this.awss3.deleteObjects(deleteParams).promise()
            if (listedObjects.IsTruncated) await this.deleteBucketDirectory(dir)

            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
}

export default AWSUtil
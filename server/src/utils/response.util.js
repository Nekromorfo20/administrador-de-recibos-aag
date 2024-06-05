/**
* @author Alan Aguilar
* @description Function to generate an endpoint response object 
* @date 21-05-2024
* @return Object
*/
export const responseUtil = (message, data) => {
    const responseObject = {
        message: `${message}` || "",
        data: data || {}
    }

    return responseObject
}
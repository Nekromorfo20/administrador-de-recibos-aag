import { v4 as uuidv4 } from 'uuid'

/**
* @author Alan Aguilar
* @description Function to generate an random image name 
* @date 04-06-2024
* @return String
*/
export const generateRandomImageName = (imageName) => {
    const arrName = imageName.split(".")
    const extImage = arrName[arrName.length - 1]
    const newName = `${uuidv4()}.${extImage}`

    return newName
}
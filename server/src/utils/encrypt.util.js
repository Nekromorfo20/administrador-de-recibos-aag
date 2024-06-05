import bcrypt from "bcrypt"

/**
* @author Alan Aguilar
* @description Function to encrypt a password
* @date 25-05-2024
* @return String
*/
export const encryptPassword = async (plaintextPassword) => {
    const hash = await bcrypt.hash(plaintextPassword, Number(process.env.API_BCRYPT_SALT_ROUNDS))
    return hash
}

/**
* @author Alan Aguilar
* @description Function to validate a encrypted pawword
* @date 25-05-2024
* @return Boolean
*/
export const validatePassword = async (plaintextPassword, hash) => {
    const result = await bcrypt.compare(plaintextPassword, hash)
    return result
}
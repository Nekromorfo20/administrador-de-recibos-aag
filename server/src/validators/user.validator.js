import Schema from 'validate'

export const UserValidator = new Schema({
  id: {
    required: false,
    type: String,
    match: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    message: 'The id does not have a valid format'
  },
  fullName: {
    required: true,
    type: String,
    match: /^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]*$/,
    message: 'The fullName was not provided or does not have a valid format'
  },
  email: {
    required: true,
    type: String,
    match: /^[a-zA-ZñÑ0-9._-]+@([a-zA-Z0-9._-]+\.)+[\w-]{2,}$/,
    message: 'The email was not provided or does not have a valid format'
  },
  password: {
    required: true,
    type: String,
    match: /^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ!#]*$/,
    message: 'The password was not provided or does not have a valid format'
  },
  phoneNumber: {
    required: false,
    type: String,
    match: /^[0-9]*$/,
    message: 'The phoneNumber does not have a valid format'
  },
  profileImg: {
    required: false,
    type: String,
    match: /(.jpg|.jpeg|.png|.gif|.tiff)+$/,
    message: 'The receiptImg extension is not valid (.jpg, .jpeg, .png, .gif, .tiff)'
  }
})
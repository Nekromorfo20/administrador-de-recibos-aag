import Schema from 'validate'

export const ReceiptValidator = new Schema({
  id: {
    required: false,
    type: Number,
    message: 'The id does not have a valid format'
  },
  userId: {
    required: true,
    type: String,
    match: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
    message: 'The userId was not provided or does not have a valid format'
  },
  provider: {
    required: true,
    type: String,
    match: /^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]*$/,
    message: 'The provider was not provided or does not have a valid format'
  },
  title: {
    required: true,
    type: String,
    match: /^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]*$/,
    message: 'The title was not provided or does not have a valid format'
  },
  receiptType: {
    required: false,
    type: String,
    match: /^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]*$/,
    message: 'The receiptType does not have a valid format'
  },
  comments: {
    required: false,
    type: String,
    match: /^[A-Za-z0-9 áéíóúÁÉÍÓÚñÑ]*$/,
    message: 'The comments does not have a valid format'
  },
  amount: {
    required: false,
    type: Number,
    message: 'The amount does not have a valid format'
  },
  badge: {
    required: false,
    type: String,
    match: /^[A-Za-z]+/,
    length: { min: 3, max: 3 },
    message: 'The badge does not have a valid format (MXN, USD, EUR)'
  },
  receiptDate: {
    required: false,
    type: Date,
    message: 'The receiptDate field does not have a valid format'
  },
  receiptImg: {
    required: false,
    type: String,
    match: /(.jpg|.jpeg|.png|.gif|.tiff)+$/,
    message: 'The receiptImg extension is not valid (.jpg, .jpeg, .png, .gif, .tiff)'
  }
})
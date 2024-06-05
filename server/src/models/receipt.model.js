import { DataTypes } from "sequelize"
import sequelize from "../connectionDB"
import UserModel from "./user.model"

const ReceiptModel = sequelize.define('receipt', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.UUIDV4,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        }
    },
    provider: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    receiptType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    comments: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(6,2),
        allowNull: true,
    },
    badge: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    receiptDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    createdDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    updatedDate: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW
    },
    receiptImg: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'receipt',
    timestamps: false
})

UserModel.hasMany(ReceiptModel, { as: 'receipt', foreignKey: 'userId' })
ReceiptModel.belongsTo(UserModel, { foreignKey: "userId" })

export default ReceiptModel
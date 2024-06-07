import { DataTypes } from "sequelize"
import sequelize from "../configs/connectionDB"
import UserModel from "./user.model"

const TokenModel = sequelize.define('token', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'user',
            key: 'id'
        }
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
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
    }
}, {
    tableName: 'token',
    timestamps: false
})

UserModel.hasMany(TokenModel, { as: 'token', foreignKey: 'userId' })
TokenModel.belongsTo(UserModel, { foreignKey: "userId" })

export default TokenModel
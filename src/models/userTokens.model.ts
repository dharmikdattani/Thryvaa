import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import Users from "./users.model"

// Define the attributes for the UsersToken model
interface UsersTokenAttributes {
    id: number;
    user_id: number;
    token: string;
    refresh_token: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define attributes that are optional during creation
interface UsersTokenCreationAttributes extends Optional<UsersTokenAttributes, "id"> { }

// Define the UsersToken model class
class UsersToken
    extends Model<UsersTokenAttributes, UsersTokenCreationAttributes>
    implements UsersTokenAttributes {
    public id!: number;
    public user_id!: number;
    public token!: string;
    public refresh_token!: string;

    // timestamps
    public createdAt!: Date;
    public updatedAt!: Date;
}

// Initialize the UsersToken model
UsersToken.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Users,
                key: 'user_id'
            }
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        refresh_token: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: "created_at",
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: "updated_at",
        },
    },
    {
        sequelize,
        modelName: "users_token", // same as table name
    }
);

export default UsersToken;

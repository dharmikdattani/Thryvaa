import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

// Define the attributes for the Users model
interface UsersAttributes {
    user_id: number;
    full_name: string;
    email: string;
    password?: string;
    is_verified?: boolean;
    oauth_provider?: string;
    oauth_id?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define attributes that are optional during creation
interface UsersCreationAttributes extends Optional<UsersAttributes, "user_id"> { }

// Define the Users model class
class Users
    extends Model<UsersAttributes, UsersCreationAttributes>
    implements UsersAttributes {
    public user_id!: number;
    public full_name!: string;
    public email!: string;
    public password?: string;
    public is_verified?: boolean;
    public oauth_provider?: string;
    public oauth_id?: string;

    // timestamps
    public createdAt!: Date;
    public updatedAt!: Date;
}

// Initialize the Users model
Users.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        full_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        is_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        oauth_provider: {
            type: DataTypes.STRING(50),
            allowNull: true,
            defaultValue: null,
        },
        oauth_id: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: null,
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
        modelName: "users", // same as table name
    }
);

export default Users;

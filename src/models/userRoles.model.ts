import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import User from "./users.model"

// Define the attributes for the UserRoles model
interface UserRolesAttributes {
    user_role_id: number;
    role_id: number;
    user_id: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define attributes that are optional during creation
interface UserRolesCreationAttributes extends Optional<UserRolesAttributes, "user_role_id"> { }

// Define the UserRoles model class
class UserRoles
    extends Model<UserRolesAttributes, UserRolesCreationAttributes>
    implements UserRolesAttributes {
    public user_role_id!: number;
    public role_id!: number;
    public user_id!: number;

    // timestamps
    public createdAt!: Date;
    public updatedAt!: Date;
}

// Initialize the UserRoles model
UserRoles.init(
    {
        user_role_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
            }
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
        modelName: "user_roles", // same as table name
    }
);

export default UserRoles;

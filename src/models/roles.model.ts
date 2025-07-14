import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";

// Define the attributes for the Roles model
interface RolesAttributes {
    id: number;
    role_name: string;
    role_slug: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define attributes that are optional during creation
interface RolesCreationAttributes extends Optional<RolesAttributes, "id"> { }

// Define the Roles model class
class Roles
    extends Model<RolesAttributes, RolesCreationAttributes>
    implements RolesAttributes {
    public id!: number;
    public role_name!: string;
    public role_slug!: string;

    // timestamps
    public createdAt!: Date;
    public updatedAt!: Date;
}

// Initialize the Roles model
Roles.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        role_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        role_slug: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
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
        modelName: "roles", // same as table name
    }
);

export default Roles;

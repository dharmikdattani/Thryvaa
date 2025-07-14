import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import User from "./users.model"

// Define the attributes for the Sellers model
interface SellersAttributes {
    id: number;
    user_id: number;
    store_name: string;
    store_description?: string;
    gst_number?: string;
    address: string;
    status?: "pending" | "active" | "rejected";
    createdAt?: Date;
    updatedAt?: Date;
}

// Define attributes that are optional during creation
interface SellersCreationAttributes extends Optional<SellersAttributes, "id"> { }

// Define the Sellers model class
class Sellers
    extends Model<SellersAttributes, SellersCreationAttributes>
    implements SellersAttributes {
    public id!: number;
    public user_id!: number;
    public store_name!: string;
    public store_description?: string;
    public gst_number?: string;
    public address!: string;
    public status?: "pending" | "active" | "rejected";

    // timestamps
    public createdAt!: Date;
    public updatedAt!: Date;
}

// Initialize the Sellers model
Sellers.init(
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
                model: User,
            }
        },
        store_name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        store_description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        gst_number: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM("pending", "active", "rejected"),
            defaultValue: "pending",
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
        modelName: "sellers", // same as table name
    }
);

export default Sellers;

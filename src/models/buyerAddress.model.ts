import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import User from "./users.model"

// Define the attributes for the BuyerAddresses model
interface BuyerAddressesAttributes {
    id: number;
    user_id: number;
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country?: string;
    is_default?: boolean;
    createdAt?: Date;
}

// Define attributes that are optional during creation
interface BuyerAddressesCreationAttributes extends Optional<BuyerAddressesAttributes, "id"> { }

// Define the BuyerAddresses model class
class BuyerAddresses
    extends Model<BuyerAddressesAttributes, BuyerAddressesCreationAttributes>
    implements BuyerAddressesAttributes {
    public id!: number;
    public user_id!: number;
    public address_line1!: string;
    public address_line2?: string;
    public city!: string;
    public state!: string;
    public postal_code!: string;
    public country?: string;
    public is_default?: boolean;

    // timestamps
    public createdAt!: Date;
}

// Initialize the BuyerAddresses model
BuyerAddresses.init(
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
                key: 'user_id'
            }
        },
        address_line1: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        address_line2: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        postal_code: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: "India",
        },
        is_default: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            field: "created_at",
        },
    },
    {
        sequelize,
        modelName: "buyer_addresses", // same as table name
        updatedAt: false, // No `updatedAt` in table, so disable in Sequelize
    }
);

export default BuyerAddresses;

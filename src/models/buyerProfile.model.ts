import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../config/database";
import User from "./users.model"

// Define the attributes for the BuyerProfiles model
interface BuyerProfilesAttributes {
    id: number;
    user_id: number;
    phone?: string;
    dob?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define attributes that are optional during creation
interface BuyerProfilesCreationAttributes extends Optional<BuyerProfilesAttributes, "id"> { }

// Define the BuyerProfiles model class
class BuyerProfiles
    extends Model<BuyerProfilesAttributes, BuyerProfilesCreationAttributes>
    implements BuyerProfilesAttributes {
    public id!: number;
    public user_id!: number;
    public phone?: string;
    public dob?: Date;

    // timestamps
    public createdAt!: Date;
    public updatedAt!: Date;
}

// Initialize the BuyerProfiles model
BuyerProfiles.init(
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
        phone: {
            type: DataTypes.STRING(15),
            allowNull: true,
        },
        dob: {
            type: DataTypes.DATEONLY,
            allowNull: true,
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
        modelName: "buyer_profiles", // same as table name
    }
);

export default BuyerProfiles;

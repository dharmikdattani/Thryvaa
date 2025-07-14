import Sellers from "../models/sellers.model";
import UserRoles from "../models/userRoles.model";
import Users from "../models/users.model";
import { Op } from "sequelize";
import { generateToken, verifyHash, verifyToken } from "../utils/encryptionUtils";
import UsersToken from "../models/userTokens.model";
import Bcrypt from "bcrypt";
import path from "path";
import fs from "fs";
import { sendEmail } from "../utils/nodeMailer.helper";


interface User {
    full_name: string;
    email: string;
    password?: string;
    is_verified?: boolean;
    oauth_provider?: string;
    oauth_id?: string;
    role_id: number;
    sellerData?: Omit<SellerDetails, 'user_id'>;
}

interface SellerDetails {
    user_id: number;
    store_name: string;
    store_description?: string;
    gst_number?: string;
    address: string;
    status?: "pending" | "active" | "rejected";
}

interface LoginResponse {
    success: boolean,
    message: string,
    error?: any
    accessToken?: {
        token: string;
        expiresIn: string;
    };
    refreshToken?: {
        token: string;
        expiresIn: string;
    };
    user?: {
        role: number;
        user_id: number;
        email: string;
        name: string;
        joined_at: Date;
    };
}

export const setresetPasswordMail = async (base64Converted: string) => {
    try {
        // 1️ Get sender email from environment variables
        const emailUser = process.env.EMAIL_USER;
        if (!emailUser) {
            throw new Error("Email credentials are not set in environment variables.");
        }

        // 2️ Decode the base64 token received from forgotPasswordService
        const buffer = Buffer.from(base64Converted, "base64url");
        const decodedString = buffer.toString("utf-8");

        // 3️ Extract user data (id, email, name) from decoded string
        const extractingId = JSON.parse(decodedString);
        const { user_id, email: userEmail, full_name: username } = extractingId;

        // 4️ Validate user ID exists
        if (!user_id) {
            throw new Error("Error: user_id is not valid.");
        }

        // 5️ Create a smaller, safer reset token containing only user_id
        const tokenPayload = JSON.stringify({ user_id });
        const token = Buffer.from(tokenPayload, "utf-8").toString("base64url");

        // 6️ Construct the reset password URL
        const frontendBase = process.env.FRONTEND_BASEURL;
        if (!frontendBase) {
            throw new Error("FRONTEND_BASEURL is not defined.");
        }
        const resetLink = `${frontendBase}reset-password?token=${token}`;

        // 7️ Locate and read the email template HTML file
        const templatePath = path.join(__dirname, '..', 'templates', 'resetPassword.html');

        if (!fs.existsSync(templatePath)) {
            throw new Error(`Template file not found at path: ${templatePath}`);
        }
        const template = fs.readFileSync(templatePath, "utf8");

        // 8️ Inject reset link into the template HTML
        const html = template.replace("{{resetLink}}", resetLink);

        // 9️ Prepare email options (recipient, subject, content)
        const emailOptions = {
            to: userEmail,
            subject: "Reset Password",
            body: html,
            username: username,
        };

        //  Send email using configured email service (e.g., SendGrid)
        const sendResult = await sendEmail(emailOptions);
        console.log("sendEmail result", sendResult);

        //  Return success from email sending
        return sendResult;

    } catch (err) {
        // 🚨 Log and return any errors
        console.error("🚨 setresetPasswordMail error:", err);
        return {
            success: false,
            message: 'Error in setresetPasswordMail',
            err: (err as Error).message || err,
        };
    }
};

export const createUserService = async (userData: User) => {
    try {
        // Hash the password if provided
        const hashedPassword = userData.password ? await Bcrypt.hash(userData.password, 10) : undefined;

        // Prepare user data for DB insertion
        const data = {
            full_name: userData.full_name,
            email: userData.email,
            password: hashedPassword,
            is_verified: userData.is_verified ?? true,
            oauth_provider: userData.oauth_provider,
            oauth_id: userData.oauth_id,
        }

        // Check if a user already exists with this email
        const recordCheck = await Users.findOne({
            where: {
                [Op.or]: [
                    { email: data.email },
                ]
            }
        })

        // If user exists, return early with an error
        if (recordCheck) {
            return {
                success: false,
                message: "Account already seems to exist with this email",
            };
        }

        // Create the user
        const user = await Users.create(data);

        // Fetch the newly created user to confirm
        const response = await Users.findOne({
            where: {
                user_id: user.user_id
            },
        });

        // If user not found after creation, return error
        if (!response) {
            return {
                success: false,
                message: "User not found",
            };
        }

        // Assign role to the user
        const userRolesData = {
            user_id: response?.dataValues.user_id,
            role_id: userData.role_id,
        }

        // Insert role mapping
        const userRole = await UserRoles.create(userRolesData);

        // Confirm role assignment
        const roleDetails = await UserRoles.findOne({
            where: {
                user_role_id: userRole?.dataValues?.user_role_id
            },
        });

        // If role not found after assignment, return error
        if (!roleDetails) {
            return {
                success: false,
                message: "User role not found",
            };
        }

        // If user is a seller (role_id 2), handle seller-specific logic
        if (userData.role_id === 2) {
            let userRolesDetails;
            const sellerData = userData.sellerData;

            // Validate required seller details
            if (!sellerData || !sellerData.store_name || !sellerData.address) {
                return {
                    success: false,
                    message: "Missing required seller data: store_name and address",
                };
            }

            // Prepare seller data for DB
            const sellerDetails: SellerDetails = {
                user_id: user.dataValues.user_id,
                store_name: sellerData.store_name,
                store_description: sellerData.store_description,
                gst_number: sellerData.gst_number,
                address: sellerData.address,
                status: "pending",
            };

            // Insert seller details
            const seller = await Sellers.create(sellerDetails);

            // Confirm seller record exists
            const sellerResponse = await Sellers.findOne({
                where: {
                    id: seller?.dataValues?.id
                },
            });

            // If seller not found after insertion, return error
            if (!sellerResponse) {
                return {
                    success: false,
                    message: "Seller not found",
                };
            }

            userRolesDetails = sellerResponse.dataValues;
        }

        // Return success response with user data
        return {
            success: true,
            message: "User created successfully",
            data: {
                data: response?.dataValues
            },
        };

    } catch (error) {
        // Catch unexpected errors and log them
        console.error("createUserService error:", error);
        return {
            success: false,
            message: "Error creating user",
            error,
        };
    }
}

export const loginUserService = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        // 1. Find user by email
        const user = await Users.findOne({ where: { email } });

        // 2. If user not found, return error
        if (!user) {
            return { success: false, message: 'Email not found!' };
        }

        // 3. If user signed up with OAuth, block password login
        if (user.oauth_provider && !user.password) {
            return {
                success: false,
                message: `This email is registered via ${user.oauth_provider}. Please log in using ${user.oauth_provider}.`,
            };
        }

        // 4. If user has no password saved, block login
        if (!user.password) {
            return { success: false, message: 'Password not set for this user.' };
        }

        // 5. Validate user password
        const isPasswordValid = await verifyHash(password, user.password);
        if (!isPasswordValid) {
            return { success: false, message: 'Invalid password!' };
        }

        // 6. Fetch user role for token payload
        const userRole = await UserRoles.findOne({ where: { user_id: user.user_id } });
        if (!userRole) {
            return { success: false, message: 'User role not found!' };
        }

        // 7. Prepare payload for access and refresh tokens
        const accessTokenPayload = {
            userId: user.user_id,
            email: user.email,
            role: userRole.role_id,
        };
        const refreshTokenPayload = {
            userId: user.user_id,
            issuedAt: Date.now(),
            role: userRole.role_id,
        };

        // 8. Generate tokens
        const accessToken = generateToken(accessTokenPayload);
        const refreshToken = generateToken(refreshTokenPayload, 'Refresh');

        // 9. Prepare token data for DB
        const tokenData = {
            user_id: user.user_id,
            token: accessToken.token,
            refresh_token: refreshToken.token,
        };

        // 10. Update or insert tokens in DB
        const existingToken = await UsersToken.findOne({ where: { user_id: user.user_id } });
        if (existingToken) {
            await UsersToken.update(tokenData, { where: { user_id: user.user_id } });
        } else {
            await UsersToken.create(tokenData);
        }

        // 11. Return success response with tokens and user info
        return {
            success: true,
            message: 'Logged in successfully',
            accessToken,
            refreshToken,
            user: {
                user_id: user.user_id,
                role: Number(userRole.role_id),
                email: user.email,
                name: user.full_name,
                joined_at: user.createdAt,
            },
        };
    } catch (error) {
        // 12. Handle unexpected errors
        console.error('Login error:', error);
        return { success: false, message: 'User login failed', error };
    }
};

export const forgotpasswordService = async (email: any) => {
    try {
        // 1️ Check if a user exists with this email
        const user = await Users.findOne({ where: { email: email } });
        // If user not found, return error
        if (!user) {
            return { success: false, message: 'Email Not Found!' };
        }

        // 2 User found — prepare a secure payload for reset link
        // Convert the user object into a JSON string
        const secureString = JSON.stringify(user);

        // Encode the string into base64 (safe to send via email URL)
        const base64Converted = Buffer.from(secureString).toString('base64');

        // 3 Send the reset password email with the encoded string
        await setresetPasswordMail(base64Converted);

        // 4 Respond with success
        return { success: true, message: 'Email sent successfully!' };

    } catch (error) {
        // 5 Handle unexpected errors
        return { success: false, message: 'Something Went Wrong!', error: error };
    }
};


export const refreshTokenService = async (refreshToken: any) => {
    try {
        // Step 1: Decode and verify the refresh token
        const decoded = await verifyToken(refreshToken, 'Refresh');

        // Extract expiration time and convert to milliseconds
        const expiryTime = (decoded.exp ?? 0) * 1000;

        // Extract user ID from decoded payload
        const id = decoded.userId;

        // Get current timestamp
        const currentDate = Date.now();

        // Step 2: Validate that the refresh token exists in the database

        const user = await UsersToken.findOne({ where: { user_id: id } });

        // const user = await DB.read('users_token', 'WHERE user_id = ?', [id]);

        if (!user) {
            return { success: false, message: 'User not found' };
        }

        // Step 3: Fetch user information from 'users' table

        const userDetails = await Users.findByPk(id)

        const email = userDetails?.dataValues?.email;  // Extract email

        // // Step 4: Retrieve user's role information
        // const user_id = user.map(id => id.user_id)[0];

        const roleName = await UserRoles.findOne({ where: { user_id: id } })

        if (!roleName) {
            return { success: false, message: 'User not found' };
        }

        // Step 5: Validate if the refresh token has expired
        if (currentDate >= expiryTime) {
            return { success: false, message: 'Refresh token expired' };
        }

        // Step 6: Generate new access and refresh tokens
        const accessTokenPayload = { userId: id, email: email, role: roleName };
        const accessToken = generateToken(accessTokenPayload, 'Access');

        const refreshTokenPayload = { userId: id, issuedAt: Date.now() };
        const newRefreshToken = generateToken(refreshTokenPayload, "Refresh");

        await UsersToken.update({ token: accessToken.token, refresh_token: newRefreshToken.token }, { where: { user_id: id } });

        // Step 8: Return success response with refreshed tokens
        return {
            success: true,
            message: 'Tokens refreshed successfully',
            data: {
                accessToken,
                refreshToken: newRefreshToken
            }
        };

    } catch (error) {
        return { success: false, message: 'Something Went Wrong', error: error };
    }
};

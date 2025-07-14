import jwt from "jsonwebtoken";
import { oauthService } from "../services/oauth.service";
import { IController } from "../types/IController";

export const oauthAuthController: IController = async (req, res) => {
    try {
        const { token, role_id } = req.body;

        const { user, isNew } = await oauthService(token, role_id);

        const secret = process.env.ACCESS_TOKEN_KEY;
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        const jwtToken = jwt.sign(
            {
                userId: user.user_id,
                email: user.email,
                role_id,
            },
            secret,
            { expiresIn: "1d" }
        );

        return res.sendRes(200, isNew ? "User created" : "Login successful", {
            token: jwtToken,
            user,
        });

    } catch (err: any) {
        console.error("OAuth error:", err);
        return res.sendRes(500, "OAuth failed", {
            error: err.message || "Something went wrong",
        });
    }
};

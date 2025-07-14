import express from "express";
import { createUpdateUser } from "../controllers/auth.controller";
import { oauthAuthController } from "../controllers/oauth.controller";
import { loginUser } from "../controllers/auth.controller";
import { forgotPassword } from "../controllers/auth.controller";
import { refreshToken } from "../controllers/auth.controller";

const userRoute: express.Router = express.Router();

userRoute.post("/user/create", createUpdateUser)
userRoute.post("/auth/oauth", oauthAuthController);
userRoute.post("/auth/login", loginUser);
userRoute.post("/auth/forgot-password", forgotPassword);
userRoute.post("/auth/refresh-token", refreshToken);


export default userRoute;
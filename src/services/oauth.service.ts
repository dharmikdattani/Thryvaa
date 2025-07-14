import Sellers from "../models/sellers.model";
import UserRoles from "../models/userRoles.model";
import Users from "../models/users.model";
import { verifyGoogleToken } from "../utils/google.helper";

export const oauthService = async (idToken: string, role_id: number) => {
    const userInfo = await verifyGoogleToken(idToken);

    const existingUser = await Users.findOne({
        where: { oauth_provider: 'google', oauth_id: userInfo.oauth_id }
    });

    if (existingUser) return { user: existingUser, isNew: false };

    const newUser = await Users.create({
        full_name: userInfo.full_name || "",
        email: userInfo.email,
        oauth_id: userInfo.oauth_id,
        oauth_provider: 'google',
        is_verified: true,
    });

    await UserRoles.create({ user_id: newUser.user_id, role_id });

    // Optionally add to buyer_profiles or sellers
    if (role_id === 1) {
        // await Buye.create({ user_id: newUser.user_id });
    } else if (role_id === 2) {
        await Sellers.create({ user_id: newUser.user_id, status: 'pending', store_name: '', address: '' });
    }

    return { user: newUser, isNew: true };
};

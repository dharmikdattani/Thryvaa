// import User from "../models/user.model"

// export const getHierarchicalUserList = async (loggedInUserId: number) => {
//     try {
//         let userIds: number[] = [];

//         // Fetch current user details
//         const userDetails = await User.findOne({
//             where: { user_id: loggedInUserId },
//         });

//         if (!userDetails) {
//             return {
//                 success: false,
//                 message: "User not found",
//             };
//         }

//         const { parent_id } = userDetails?.dataValues;

//         // Determine the parent reference
//         const parentIdToUse = parent_id ? parent_id : loggedInUserId;

//         // Fetch users associated with that parent
//         const usersData = await User.findAll({
//             where: {
//                 parent_id: parentIdToUse,
//             },
//         });

//         if (!usersData) {
//             return {
//                 success: false,
//                 message: "No Users found",
//             };
//         }

//         // Extract and return user IDs
//         userIds = usersData.map((user) => user?.dataValues?.user_id);
//         const hierarchicalUserIds = Array.from(new Set([parentIdToUse, ...userIds]));

//         return {
//             success: true,
//             message: "User list fetched successfully",
//             data: hierarchicalUserIds,
//         };

//     } catch (error) {
//         console.error("getUserHelper error:", error);
//         return {
//             success: false,
//             message: "Error fetching user details",
//             error,
//         };
//     }
// };

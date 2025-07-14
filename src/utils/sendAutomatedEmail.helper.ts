// import { Customer } from "../models";
// import CustomerTag from "../models/customerTag.model";
// import { sendEmail } from "./nodeMailer.helper";

// export const sendAutomatedEmail = async (rules: any, username?: string, customerEmail?: string ) => {
//     try {
//       const emailData = rules?.communications_email_recipient_and_text?.dataValues;
//       const emailInfo = JSON.parse(emailData.email_info)

//       let emailObj = "";
//       let emailText = "";

//       // 1) Look for language 3
//       for (const el of emailInfo) {
//         if (el.language === 3) {
//           ({ object: emailObj, text: emailText } = el);
//           break;
//         }
//       }

//       // 2) If not found, look for language 8
//       if (!emailObj) {
//         for (const el of emailInfo) {
//           if (el.language === 8) {
//             ({ object: emailObj, text: emailText } = el);
//             break;
//           }
//         }
//       }

//       // 3) Final fallback to first element
//       if (!emailObj && emailInfo.length) {
//         ({ object: emailObj, text: emailText } = emailInfo[0]);
//       }


//       if (emailData?.sendemail) {
//         const to = customerEmail?.trim() ? customerEmail : emailData.recipient;
//         const cc = customerEmail?.trim() ? "" : emailData.cc;
      
//         await sendEmail({
//           to,
//           cc,
//           subject: emailObj,
//           body: emailText,
//           username,
//         });
//       } else {
//         const customerDetails = await CustomerTag.findAll({
//           where: {
//             tag_id: emailData.recipient,
//           }
//         })

//         if (customerDetails.length > 0) {
//           for (const element of customerDetails) {
//             const customerId = element.dataValues.customer_id;
//             const customer = await Customer.findOne({
//               where: {
//                 id: customerId
//               }
//             })

//             if (customer?.dataValues.email) {
//               await sendEmail({
//                 to: customer.dataValues.email,
//                 cc: emailData.cc,
//                 subject: emailObj,
//                 body: emailText,
//                 username,
//               });
//             }
//           }
//         } else {
//           await sendEmail({
//             to: emailData.recipient,
//             cc: emailData.cc,
//             subject: emailObj,
//             body: emailText,
//             username,
//           });
//         }
//       }

//     } catch (error) {
//       console.error("Error sending automated email:", error);
//     }
//   };
  
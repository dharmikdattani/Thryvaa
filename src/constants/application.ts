// Import dotenv and load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

// Access the environment variable
const jwtSecret = process.env.ACCESS_TOKEN_KEY;
const refreshSecret = process.env.REFRESH_TOKEN_KEY;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

const base = '/api';

const application = {
  url: {
    base,
  },
  timers: {
    userTokenExpiry: '1d',
  },
  env: {
    jwtSecret,
    refreshSecret,
    emailUser,
    emailPass,
  },
  authorizationIgnorePath: [
    // add routes that you don't require token
    `${base}/onboard/countrylist`,
    `${base}/onboard/services`,
    `${base}/onboard/register`,
    `${base}/onboard/states`,
    `${base}/onboard/states`,
    `${base}/onboard/regions`,
    `${base}/onboard/sub-regions`,
    `${base}/onboard/validate-vatcode`,
    `${base}/product/getproducts`,
    `${base}/faq/faqlist`,
    `${base}/auth/login`,
    `${base}/auth/refreshToken`,
    `${base}/auth/verify-otp`,
    `${base}/auth/resend-otp`,
    `${base}/auth/forgot-password`,
    `${base}/auth/reset-password`,
    `${base}/user/login`,
    `${base}/user/register`,
    `${base}/ping`,
    `${base}/test`,
    `${base}/sdi`
  ],
};

export { application };

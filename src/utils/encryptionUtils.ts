import jwt, { SignOptions, JwtPayload, VerifyErrors } from "jsonwebtoken"
import { application } from "../constants/application";
import { logger } from "../config/logger";
import bcrypt from "bcrypt";

interface Payload {
  [key: string]: any;
}
interface TokenResponse {
  token: string;
  expiresIn: string;
}

const jwtSecret: string = application.env.jwtSecret || 'your_secret_key';
const refreshSecret: string = application.env.refreshSecret || 'your_secret_key';
const expiresTime: string = "1d";
const refreshExpiresTime: string = "7d";

/**
 * Verifies if a plain text password matches a hashed password.
 * @param plainTextPassword - The plain text password to verify.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A promise that resolves to true if the passwords match, otherwise false.
 */
async function verifyHash(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
  try {
    const isPasswordValid = await bcrypt.compare(plainTextPassword, hashedPassword);
    return isPasswordValid;
  } catch (error) {
    console.error('Error verifying hash:', error);
    return false;
  }
}

// Generate a JWT token
function generateToken(payload: Payload, type: 'Access' | 'Refresh' = 'Access', expiresIn: string = expiresTime): TokenResponse {
  const options: SignOptions = {
    expiresIn
  };

  let token: string;
  if (type === "Access") {
    token = jwt.sign(payload, jwtSecret, options);
  } else {
    options.expiresIn = refreshExpiresTime;    
    token = jwt.sign(payload, refreshSecret, options);
  }
  return { token, expiresIn: options.expiresIn as string };
}

// Verify a JWT token
function verifyToken(token: string, type: 'Access' | 'Refresh' = 'Access'): Promise<jwt.JwtPayload> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, type === "Access" ? jwtSecret : refreshSecret, (err: VerifyErrors | null, decoded) => {
      if (err) {
        logger.error(`Error verifying token: ${err}`);
        return reject(err);
      }
      resolve(decoded as JwtPayload);
    });
  });
};

// Decode a JWT token without verifying
function decodeToken(token: string): Payload | null {
  const decoded = jwt.decode(token);
  return decoded as JwtPayload | null;
}

// Check if a token is expired
function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true;
  }
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

export {
  verifyHash,
  generateToken,
  verifyToken,
  decodeToken,
  isTokenExpired
}
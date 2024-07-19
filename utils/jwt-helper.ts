import {
  ACCESS_TOKEN_LIFETIME,
  REFRESH_TOKEN_LIFETIME,
  TOKEN_SECRET,
} from "../constants";
import * as jwt from "jsonwebtoken";

const generateJWT = (data: {}, expiresIn: string) => {
  return jwt.sign(data, TOKEN_SECRET as string, { expiresIn });
};

const generateAccessToken = (data: {}) => {
  return generateJWT(data, ACCESS_TOKEN_LIFETIME);
};

const generateRefreshToken = (data: {}) => {
  return generateJWT(data, REFRESH_TOKEN_LIFETIME);
};

const generateTokens = (data: {}) => {
  const accessToken = generateAccessToken(data);
  const refreshToken = generateRefreshToken(data);

  return [accessToken, refreshToken];
};

const verifyToken = (
  token: any,
  callbackFn?: (err: Error | null, userData: any) => void
) => {
  jwt.verify(token, TOKEN_SECRET as string, callbackFn);
};

export {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
  verifyToken,
};

import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 8080;
export const TOKEN_SECRET = process.env.TOKEN_SECRET;
export const MONGO_URI = process.env.MONGO_URI;
export const CLIENT_URL = process.env.CLIENT_URL;
export const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY

export const REFRESH_TOKEN_KEY = "refreshToken";
export const ACCESS_TOKEN_LIFETIME = "20s"; //30min
export const REFRESH_TOKEN_LIFETIME = "1m";

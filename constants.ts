import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 8080;
export const TOKEN_SECRET = process.env.TOKEN_SECRET;
export const MONGO_URI =
  "mongodb+srv://sadeepthabandara:rUHoq7acZ6wkjLre@cluster0.l8iwle2.mongodb.net/laureates?retryWrites=true&w=majority&appName=Cluster0";
export const CLIENT_URL = process.env.CLIENT_URL;

export const REFRESH_TOKEN_KEY = "refreshToken";
export const ACCESS_TOKEN_LIFETIME = "30m"; //30min
export const REFRESH_TOKEN_LIFETIME = "1h";

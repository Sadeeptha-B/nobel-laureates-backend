import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import morgan from "morgan";

import userRouter from "./routes/users-routes";
import commentsRouter from "./routes/comments-routes";
import HttpError from "./models/http-error";
import { PORT, MONGO_URI, CLIENT_URL } from "./constants";

//Express
const app = express();
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true, // pass in cookies, auth headers
  })
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("dev"))
app.use("/api/users", userRouter);
app.use("/api/comments", commentsRouter);

app.use((req, res, next) => {
  throw new HttpError("Unknown path", 404);
});

// Error handling
app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  // Delegate to inbuilt error handler
  if (res.headersSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred" });
});

// Database and server setup
mongoose
  .connect(MONGO_URI as string)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Database Connection Error"));



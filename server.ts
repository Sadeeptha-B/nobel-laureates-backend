import dotenv from "dotenv";
import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import userRouter from "./routes/users-routes";
import HttpError from "./models/http-error";
import commentsRouter from "./routes/comments-routes";
import mongoose from "mongoose";

// Config
dotenv.config();
const PORT = process.env.PORT as string;
const MONGO_URI = process.env.MONGO_URI as string;

//Express
const app = express();
app.use(bodyParser.json());
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
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("Database Connection Error"));

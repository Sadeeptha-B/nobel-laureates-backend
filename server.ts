import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import userRouter from "./routes/users-routes";
import HttpError from "./models/http-error";

const PORT = 3000;
const app = express();

// Middleware
app.use(bodyParser.json());
app.use("/api/users", userRouter);

app.use((req, res, next) => {
  throw new HttpError("Unknown path", 404);
});

app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
  // Delegate to inbuilt error handler
  if (res.headersSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred" });
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);

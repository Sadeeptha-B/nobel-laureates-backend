import bodyParser from "body-parser";
import express from "express";
import userRouter from "./routes/users-routes";

const PORT = 3000;

const app = express();

// Middleware
app.use(bodyParser.json());
app.use("/api/users", userRouter)


app.listen(PORT);

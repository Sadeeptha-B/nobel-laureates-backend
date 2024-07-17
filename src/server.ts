import express, { Request, Response } from "express";

// Create an Express application
const app = express();
const port = 3000;

// Define a route for the root path ('/')
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript + Node.js + Express!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

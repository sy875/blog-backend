import app from "./app";
import { connectDb } from "./db";
import dotenv from "dotenv";

const port = process.env.PORT || 5000;

dotenv.config({
  path: "./env",
});

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

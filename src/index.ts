import app from "./app.js";
import { connectDb } from "./db/index.js";


const port = process.env.PORT || 5000;


connectDb().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

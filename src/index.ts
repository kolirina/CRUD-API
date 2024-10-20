import { config } from "dotenv";
import { createServer } from "./server";

config();

const port = process.env.PORT || 3000;
createServer().listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { createAdmin } from "./src/utils/createAdmin.js";

connectDB();
await createAdmin();

const PORT = process.env.SERVER_PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at the port ${PORT}`);
});
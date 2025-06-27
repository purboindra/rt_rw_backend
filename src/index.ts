import express from "express";
import userRoutes from "./routes/user.route";
import rtRoutes from "./routes/rt.route";

import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const dbUrl = process.env.DATABASE_URL || "Not found";

console.log("DATABASE_URL:", dbUrl);
app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/rt", rtRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});

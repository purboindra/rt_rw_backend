import express from "express";
import userRoutes from "./routes/user.route";
import rtRoutes from "./routes/rt.route";
import authRoutes from "./routes/auth.routes";
import { toNodeHandler } from "better-auth/node";

import dotenv from "dotenv";
import { auth } from "./lib/auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

// Routes
app.use("/users", userRoutes);
app.use("/rt", rtRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
});

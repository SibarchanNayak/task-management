import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import { PORT } from "./config/index.js";
import errorHandler from "./src/middleware/errorHandler.js";
import authRoutes from "./src/routes/authRoutes.js";
import taskRoutes from "./src/routes/taskRoutes.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());

app.use(
  cors({
    origin: function (origin, callback) {
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running successfully!",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);

connectDB();

app.use(errorHandler);

app.listen(PORT || 5000, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

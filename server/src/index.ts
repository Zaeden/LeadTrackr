import express, { Request, Response } from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import leadRouter from "./routes/lead.route";
import courseRouter from "./routes/course.route";
import path from "path";
import followUpRouter from "./routes/followUps.route";
import dashboardRouter from "./routes/dashboard.route";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 8000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "../../client/dist")));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/leads", leadRouter);
app.use("/api/courses", courseRouter);
app.use("/api/follow-ups", followUpRouter);
app.use("/api/dashboard", dashboardRouter);

app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on Port ${PORT}`);
});

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(express.static("public"));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cors({ origin: process.env.CORS_ORIGIN }));

//import user router
import userRouter from "./routes/user.route.js";
import categoryRouter from "./routes/category.route.js";

//implement this userRouter
app.use("/api/v1/users", userRouter);
app.use("/api/v1/category", categoryRouter);

export default app;

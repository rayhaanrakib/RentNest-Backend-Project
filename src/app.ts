import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config";
import { userRouter } from "./modules/user/user.route";
import { authRouter } from "./modules/auth/auth.route";
import { RouteHandler } from "./middlewares/routeHandler";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";

const app: Application = express();

// CORS — allow requests from the configured app URL
app.use(
  cors({
    origin: config.appUrl,
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "success",
    message: "RentNest is a backend API for a rental marketplace.",
    live_server: "https://rayhaanrakib-rentnest.vercel.app",
    api_documentation:
      "https://documenter.getpostman.com/view/55143757/2sBY4LQM5J",
    database: "PostgreSQL",
    framework: "Express.js",
    language: "TypeScript",
    hosting: "Vercel",
    timestamp: new Date().toISOString(),
    browser: req.get("User-Agent"),
    developer: "Rayhan",
    developer_portfolio: "https://rayhaanrakib.vercel.app",
  });
  res.status(200);
});

// API Routes
app.use("/api/auth", authRouter);
// app.use("/api/user", userRouter);

// middlewares
app.use(RouteHandler);
app.use(globalErrorHandler);

export default app;

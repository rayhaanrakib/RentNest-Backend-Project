import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config";
import { RouteHandler } from "./middlewares/routeHandler";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { userRouter } from "./modules/user/user.route";
import { authRouter } from "./modules/auth/auth.route";
import { propertyRouter } from "./modules/property/property.route";
import { categoryRouter } from "./modules/category/category.route";
import { adminRouter } from "./modules/admin/admin.route";
import { rentalRouter } from "./modules/rental/rental.route";
import { paymentRouter } from "./modules/payment/payment.route";

const app: Application = express();

// CORS — allow requests from the configured app URL
app.use(
  cors({
    origin: config.appUrl,
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// stripe webhook
app.use("/api/payments/webhook", express.raw({ type: 'application/json' }))


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
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/properties", propertyRouter);
app.use("/api/rentals", rentalRouter);
app.use("/api/payments", paymentRouter)

// middlewares
app.use(RouteHandler);
app.use(globalErrorHandler);

export default app;

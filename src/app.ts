import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config";

const app: Application = express();

// CORS — allow requests from the configured app URL
app.use(
  cors({
    origin: config.appUrl,
    credentials: true,
  }),
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Health check route
app.get("/", (req: Request, res: Response) => {
  // more visual response
  res.json({
    status: "success",
    message:
      "RentNest is a backend API for a rental marketplace.",
      live_server: "https://rayhaanrakib-rentnest.vercel.app",
      api_documentation: "https://documenter.getpostman.com/view/55143757/2sBY4LQM5J",
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

export default app;

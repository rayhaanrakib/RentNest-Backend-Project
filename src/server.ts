import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

const PORT = config.port;

// Local development: start the HTTP server
if (process.env.NODE_ENV !== "production") {
  async function main() {
    try {
      await prisma.$connect();
      console.log("Connected to Prisma database");
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error("Error starting server:", error);
      await prisma.$disconnect();
      console.log("Disconnected from Prisma database");
      process.exit(1);
    }
  }

  main();
}

// Vercel serverless: export app as default handler
export default app;

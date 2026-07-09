import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  appUrl: process.env.APP_URL,
  databaseUrl: process.env.DATABASE_URL,
  bcryptSaltRounds: process.env.BCRYPT_SALT_ROUNDS,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET!,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET!,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN!,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN!,
  stripeProductId: process.env.STRIPE_PRODUCT_ID!,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY!,
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  stripeProductPriceId: process.env.STRIPE_PRODUCT_PRICE_ID!,
};
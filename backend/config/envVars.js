import dotenv from "dotenv";

dotenv.config();

export const ENV_VARS = {
  PG_URI: process.env.PG_URI,
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  MIDTRANS_SERVER_KEY: process.env.MIDTRANS_SERVER_KEY,
  MIDTRANS_CLIENT_KEY: process.env.MIDTRANS_CLIENT_KEY,
};
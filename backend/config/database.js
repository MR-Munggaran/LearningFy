import pkg from "pg";
import { ENV_VARS } from "./envVars.js";

const { Pool } = pkg;

const pool = new Pool({
  connectionString: ENV_VARS.PG_URI, // ganti ENV jadi PG_URI misalnya
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log("PostgreSQL connected: " + client.host);
    client.release(); // jangan lupa release ke pool
  } catch (error) {
    console.error("Error connecting to PostgreSQL: " + error.message);
    process.exit(1);
  }
};

export default pool;

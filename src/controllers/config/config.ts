import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  SUPABASE_URL: string;
  SUPBASE_SERVICE_KEY: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 8080,
  nodeEnv: process.env.NODE_ENV || "DEV",
  SUPABASE_URL: process.env.SUPABASE_URL || "",
  SUPBASE_SERVICE_KEY: process.env.SUPBASE_SERVICE_KEY || "",
} satisfies Config;

export default config;

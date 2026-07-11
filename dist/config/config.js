import dotenv from "dotenv";
dotenv.config();
const config = {
    port: Number(process.env.PORT) || 8080,
    nodeEnv: process.env.NODE_ENV || "DEV",
};
export default config;
//# sourceMappingURL=config.js.map
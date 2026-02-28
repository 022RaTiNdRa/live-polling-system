export const appConfig = {
  port: Number(process.env.PORT) || 5001,
  corsOrigin: process.env.CORS_ORIGIN || "*",
};
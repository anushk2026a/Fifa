import winston from "winston";

const { combine, timestamp, json, colorize, printf } = winston.format;

const isProd = process.env.NODE_ENV === "production";

const devFormat = combine(
  colorize(),
  timestamp({ format: "HH:mm:ss" }),
  printf(({ level, message, timestamp: ts, ...meta }) => {
    const extras = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${ts} ${level}: ${message}${extras}`;
  }),
);

const prodFormat = combine(timestamp(), json());

export const logger = winston.createLogger({
  level: isProd ? "info" : "debug",
  format: isProd ? prodFormat : devFormat,
  transports: [new winston.transports.Console()],
});

import winston from 'winston';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which logs to print based on environment
const level = () => {
  const env = process.env['NODE_ENV'] || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console(),
  // File transport for errors
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'error.log'),
    level: 'error',
  }),
  // File transport for all logs
  new winston.transports.File({
    filename: path.join(process.cwd(), 'logs', 'all.log'),
  }),
];

// Create the logger
export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

// Create a stream object for Morgan HTTP logger
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// WebSocket specific logging utilities
export const logWebSocket = {
  connection: (userId: string, socketId: string) => {
    logger.info(`WebSocket connection established - User: ${userId}, Socket: ${socketId}`);
  },
  disconnection: (userId: string, socketId: string) => {
    logger.info(`WebSocket connection closed - User: ${userId}, Socket: ${socketId}`);
  },
  joinRoom: (userId: string, room: string) => {
    logger.debug(`User ${userId} joined room: ${room}`);
  },
  leaveRoom: (userId: string, room: string) => {
    logger.debug(`User ${userId} left room: ${room}`);
  },
  emit: (event: string, room: string, data?: any) => {
    logger.debug(`WebSocket event '${event}' emitted to room: ${room}`);
  },
  error: (message: string, error?: any, meta?: any) => {
    logger.error(`WebSocket error: ${message}`, { error: error?.message || error, ...meta });
  }
};
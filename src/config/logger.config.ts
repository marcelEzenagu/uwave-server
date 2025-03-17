import { createLogger, format, transports } from 'winston';
import * as path from 'path';
import * as fs from 'fs';

const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  return `${timestamp} ${level}: ${message} ${JSON.stringify(metadata)}`;
});

// Create absolute paths to log files
const logDir = path.join(process.cwd(), 'logs');
const errorLogPath = path.join(logDir, 'error.log');
const combinedLogPath = path.join(logDir, 'combined.log');

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

export const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    format.colorize(),
    logFormat
  ),
  transports: [
    new transports.Console({
      level: 'info',
    }),
    new transports.File({ 
      filename: errorLogPath, 
      level: 'error',
    }),
    new transports.File({ 
      filename: combinedLogPath,
    })
  ]
});




import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../../../config/logger.config';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip, body } = req;

    // Capture the start time of the request
    const start = Date.now();

    // Log the incoming request with the request body
    logger.info(`Request: ${method} ${originalUrl} from ${ip}`, {
      body: this.sanitizeRequestBody(body),
    });

    // Capture the response finish event
    const originalSend = res.send;
    const responseBody = {
      content: null,
    };

    // Override the res.send method to capture the response body
    res.send = function (body) {
      responseBody.content = body;
      return originalSend.call(this, body);
    };

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      const contentLength = res.get('Content-Length') || 0;

      // Log the response with the response body
      if (statusCode >= 400) {
        logger.error(`Response: ${method} ${originalUrl} - ${responseBody.content}, Duration: ${duration}ms, Content-Length: ${contentLength} `);
      } else {
        logger.info(`Response: ${method} ${originalUrl} - Status: ${statusCode}, Duration: ${duration}ms, Content-Length: ${contentLength}`);
      }

      //Todo: log response body.
    });

    next();
  }

  // Helper method to sanitize the request body (e.g., remove sensitive fields)
  private sanitizeRequestBody(body: any): any {
    if (!body) return body;

    // Remove sensitive fields like 'password' or 'token'
    const sanitizedBody = { ...body };
    if (sanitizedBody.password) {
      sanitizedBody.password = '*****';
    }
    if (sanitizedBody.token) {
      sanitizedBody.token = '*****';
    }

    return sanitizedBody;
  }
}
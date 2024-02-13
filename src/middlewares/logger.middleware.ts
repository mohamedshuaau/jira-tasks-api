import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '@nestjs/common';

export function loggerMiddleware(loggerService: LoggerService) {
  return function (req: Request, res: Response, next: NextFunction): void {
    loggerService.log(`[${req.method}]: ${req.originalUrl} ${Date.now()}`);
    next();
  };
}

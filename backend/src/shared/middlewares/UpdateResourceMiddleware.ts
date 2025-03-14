

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UpdateResourceMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.body.id = req.params.id
    next();
  }
}
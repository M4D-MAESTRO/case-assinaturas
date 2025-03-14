import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, BadRequestException, InternalServerErrorException, Body } from '@nestjs/common';
import { Response } from 'express';
import { MensagesConstants } from './../../shared/constants/mensages.constant';

@Catch(InternalServerErrorException)
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const detail = process.env.MODE == 'DEV' ? exception.message : undefined;
    const stack = process.env.MODE == 'DEV' ? exception.stack : undefined;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = MensagesConstants.ERRO_INESPERADO;

    response.status(status).json({
      statusCode: status,
      message,
      detail,
      stack,
    });

  }
}

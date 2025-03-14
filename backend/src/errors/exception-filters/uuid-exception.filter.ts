import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { MensagesConstants } from './../../shared/constants/mensages.constant';

@Catch(QueryFailedError)
export class UUIDExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    const detail = process.env.MODE == 'DEV' ? exception.message : undefined;
    const stack = process.env.MODE == 'DEV' ? exception.stack : undefined;
    if (!exception.message.toLowerCase().includes('invalid input syntax for type uuid')) {
      const status = HttpStatus.INTERNAL_SERVER_ERROR;
      return response.status(status).json({
        statusCode: status,
        message: MensagesConstants.ERRO_INESPERADO,
        detail,
        stack,
      });
    }

    const status = HttpStatus.BAD_REQUEST;
    const message = ['UUID inválido ou mal formado'];

    return response.status(status).json({
      statusCode: status,
      message,
      detail,
      stack,
    });
  }
}

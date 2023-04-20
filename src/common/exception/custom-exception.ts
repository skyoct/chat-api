import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ResponseUtil } from '../utils/response';

export class CustomException extends HttpException {
    constructor(message: string) {
      super(message, HttpStatus.BAD_REQUEST);
    }
}

@Catch(CustomException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: CustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.status(HttpStatus.OK).json(ResponseUtil.requestError(exception.message));
  }
}


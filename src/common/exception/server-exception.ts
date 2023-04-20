import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ResponseUtil } from '../utils/response';

export class ServerException extends Error {
    constructor(message: string) {
      super(message);
    }
}

@Catch(ServerException)
export class ServerExceptionFilter implements ExceptionFilter {
  catch(exception: ServerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    response.status(HttpStatus.OK).json(ResponseUtil.requestError(exception.message));
  }
}


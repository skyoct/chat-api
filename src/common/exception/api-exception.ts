import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { ResponseUtil } from '../utils/response';

export class ApiException extends HttpException {
    
    code: number

    constructor(code: number, message: string) {
      super(message, code);
    }
}

@Catch(ApiException)
export class ApiExceptionFilter implements ExceptionFilter {
    catch(exception: ApiException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        response.status(HttpStatus.OK).json(new ResponseUtil(exception.code, exception.message));
    }
}
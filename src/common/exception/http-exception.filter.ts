import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
import { ResponseUtil } from '../utils/response';
  
  @Catch(HttpException)
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status = exception.getStatus();
  
      if (status === 401) {
        response.status(200).json(ResponseUtil.unauthorized(exception.message));
      } else if (status == 400){
        response.status(200).json(ResponseUtil.requestError(exception.message));
      }else {
        response.status(200).json(ResponseUtil.serverError(exception.message));
      }
    }
  }
  
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ApiException } from "src/common/exception/api-exception";
import { CustomException } from "src/common/exception/custom-exception";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'] as string;
    console.log(token);
    if (token === "") {
      throw new ApiException(401, '认证失败');
    }
    try {
        const payload = this.jwtService.verify(token.replace('Bearer ', ''));
    }
    catch (e) {
        throw new ApiException(401, '认证失败');
    }
    return true;
  }
  
}
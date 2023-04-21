import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResponseUtil } from 'src/common/utils/response';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    ) {}

  @Post('auth')
  isAuth() {
    return ResponseUtil.ok({auth: true});
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return ResponseUtil.ok(await this.userService.login(loginUserDto));
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    await this.userService.create(createUserDto)
    return ResponseUtil.ok({});
  }

  @Get('code')
  async sendCode(@Query('telphone') telphone: string) {
    return ResponseUtil.ok(await this.userService.sendSms(telphone));
  }

}

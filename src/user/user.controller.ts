import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ResponseUtil } from 'src/common/utils/response';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('auth')
  isAuth() {
    return ResponseUtil.ok({auth: true});
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return ResponseUtil.ok(await this.userService.login(loginUserDto));
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}

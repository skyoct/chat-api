import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Captcha } from './entities/captcha.entity';
import { SmsService } from './sms.service';
import { ServerConfig } from 'src/config';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.register({
    secret: ServerConfig.JWT_SECRET,
  }),
  TypeOrmModule.forFeature([Captcha])],
  controllers: [UserController],
  providers: [UserService, SmsService]
})
export class UserModule {}

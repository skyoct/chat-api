import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ServerConfig } from 'src/config';

@Module({
  imports: [TypeOrmModule.forFeature([User]),
  JwtModule.register({
    secret: '123',
  })],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}

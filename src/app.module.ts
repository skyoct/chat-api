import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, RouterModule } from '@nestjs/core';
import { CustomExceptionFilter } from './common/exception/custom-exception';
import { ServerExceptionFilter } from './common/exception/server-exception';
import { HttpExceptionFilter } from './common/exception/http-exception.filter';
import { JwtModule } from '@nestjs/jwt';
import { ServerConfig } from './config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'mysql',
    host: '43.163.233.162',
    port: 3306,
    username: 'root',
    password: 'ai332211..',
    database: 'chatai',
    synchronize: true,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
  }),
  RouterModule.register([
    {
      path: '/api',
      module: UserModule,
      children: [
        {path: '/', module: UserModule},
        {path: '/', module: ChatModule},
        ],
  }]),
  ChatModule, UserModule],
  controllers: [],
  providers: [{
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
    },{
    provide: APP_FILTER,
    useClass: CustomExceptionFilter,
    }, {
    provide: APP_FILTER,
    useClass: ServerExceptionFilter,
    }],
})
export class AppModule {}

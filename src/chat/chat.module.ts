import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGPTApi } from './gpt.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ServerConfig } from 'src/config';

@Module({
  imports: [JwtModule.register({
    secret: ServerConfig.JWT_SECRET,
  })],
  controllers: [ChatController],
  providers: [ChatService, ChatGPTApi],
})
export class ChatModule {}

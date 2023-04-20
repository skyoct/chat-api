import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGPTApi } from './gpt.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, ChatGPTApi],
})
export class ChatModule {}

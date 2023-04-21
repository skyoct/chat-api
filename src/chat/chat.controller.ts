import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpCode, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRequestDto } from './dto/chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/user/auth.guard';

@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    ) {}

  @Post('process')
  async process(@Body() chatRequestDto: ChatRequestDto, @Res() res: Response) {
    await this.chatService.process(chatRequestDto, res)
  }

  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }
}

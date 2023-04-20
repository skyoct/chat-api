import { PartialType } from '@nestjs/mapped-types';
import { ChatRequestDto } from './chat.dto';

export class UpdateChatDto extends PartialType(ChatRequestDto) {}

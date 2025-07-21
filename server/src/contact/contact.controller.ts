import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactMessageDto } from './dto/contact-message.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async send(@Body() dto: ContactMessageDto) {
    return this.contactService.sendMessage(dto);
  }

  @Get()
  async getAllMessages() {
    return this.contactService.findAll();
  }

  @Get(':id')
  async getMessage(@Param('id') id: string) {
    return this.contactService.findOne(+id);
  }
}

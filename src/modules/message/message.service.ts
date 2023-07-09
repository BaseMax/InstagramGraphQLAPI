import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { CreateMessageInput } from './dto/create-message.dto';
import { Message } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}

  async sendDirectMessage(input: CreateMessageInput) {
    const senderFound = await this.userService.findUserById(input.senderId);
    const reciptientFound = await this.userService.findUserById(
      input.reciptientId,
    );
    const MessageCreated = await this.prismaService.message.create({
      data: {
        ...input,
      },
    });
    return MessageCreated;
  }

  async retrieveDirectMessages(userId: number) {
    const userFound = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        messagesReceived: true,
      },
    });
    return userFound.messagesReceived;
  }

  async markMessageAsRead(messageId: number): Promise<Message> {
    if (!messageId) {
      throw new BadRequestException('message id is invalid');
    }
    const messageFound = await this.prismaService.message.findUnique({
      where: {
        id: messageId,
      },
    });
    return messageFound;
  }
}

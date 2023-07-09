import { ParseIntPipe } from '@nestjs/common';
import { Mutation, Resolver, Args, Query } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { CreateMessageInput } from './dto/create-message.dto';
import { Message } from './message.model';
import { MessageService } from './message.service';

@Resolver('message')
export class MessageResolver {
  constructor(private messageService: MessageService) {}
  @Mutation(() => Message)
  async sendDirectMessage(@Args('input') input: CreateMessageInput) {
    return await this.messageService.sendDirectMessage(input);
  }

  @Query(() => [Message])
  async retrieveDirectMessages(@Args('userId', ParseIntPipe) userId: number) {
    return await this.messageService.retrieveDirectMessages(userId);
  }

  @Mutation(() => Message)
  async markMessageAsRead(@Args('messageId', ParseIntPipe) messageId: number) {
    return await this.messageService.markMessageAsRead(messageId);
  }

  
}

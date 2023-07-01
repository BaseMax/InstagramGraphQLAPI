import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageResolver } from './message.resolver';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';

@Module({
  providers: [MessageService, MessageResolver],
  imports: [PrismaModule, UserModule],
})
export class MessageModule {}

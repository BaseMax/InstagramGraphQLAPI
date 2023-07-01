import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationResolver } from './notification.resolver';
import { NotificationService } from './notification.service';

@Module({
  providers: [NotificationService, NotificationResolver],
  imports : [PrismaModule]
})
export class NotificationModule {}

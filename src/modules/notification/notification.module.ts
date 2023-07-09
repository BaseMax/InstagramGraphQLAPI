import { Module } from '@nestjs/common';
import { NotificationResolver } from './notification.resolver';
import { NotificationService } from './notification.service';

@Module({
  providers: [NotificationService, NotificationResolver],
})
export class NotificationModule {}

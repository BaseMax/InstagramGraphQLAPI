import { Module } from '@nestjs/common';
import { NotificationController } from './notification.resolver';
import { NotificationService } from './notification.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService]
})
export class NotificationModule {}

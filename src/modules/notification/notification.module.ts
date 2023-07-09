import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { NotificationResolver } from './notification.resolver';
import { NotificationService } from './notification.service';
@Module({
  providers: [NotificationService, NotificationResolver],
  imports: [PrismaModule, UserModule],
})
export class NotificationModule {}

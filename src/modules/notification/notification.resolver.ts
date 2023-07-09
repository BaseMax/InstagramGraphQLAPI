import { Args, Resolver, Mutation } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationService } from './notification.service';
import { Notification } from './notification.model';

@Resolver('notification')
export class NotificationResolver {
  constructor(private notificationService: NotificationService) {}

  @Mutation(() => Notification)
  async sendPushNotification(@Args('input') input: CreateNotificationDto) {
    return this.notificationService.createNotification(input);
  }
}

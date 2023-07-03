import { Injectable, HttpException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import * as firebase from 'firebase-admin';
import * as path from 'path';
import { Notification } from '@prisma/client';
firebase.initializeApp({
  credential: firebase.credential.cert(
    path.join(__dirname, '..', '..', '..', 'firebase-adminsdk.json'),
  ),
});

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}
  async createNotification(
    notificationDto: CreateNotificationDto,
  ): Promise<Notification | null> {
    try {
      const { userId, notification_token, device_type } = notificationDto;
      if (!userId) {
        throw new BadRequestException('user id is invalid');
      }

      if (!notification_token) {
        throw new BadRequestException('notification token is invalid');
      }

      if (!device_type) {
        throw new BadRequestException('device type is invalid');
      }
      let notificationToken =
        await this.prismaService.notificationToken.findUnique({
          where: {
            notification_token: notification_token,
          },
        });
      if (!notificationToken) {
        notificationToken = await this.prismaService.notificationToken.create({
          data: {
            userId: userId,
            notification_token: notification_token,
            device_type: device_type,
          },
        });
      }
      const { title, body } = notificationDto;
      let notification = await this.prismaService.notification.create({
        data: {
          title: title,
          body: body,
          notificationTokenId: notificationToken.id,
          userId: userId,
        },
      });
      firebase
        .messaging()
        .send({
          notification: { title, body },
          token: notificationDto.notification_token,
        })
        .catch((error: any) => {
          console.error('error while sending message: ', error);
        });
      return notification;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}

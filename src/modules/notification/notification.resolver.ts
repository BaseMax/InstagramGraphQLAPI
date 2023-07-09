import { Resolver } from '@nestjs/graphql';
import { PrismaService } from '../prisma/prisma.service';
import {UserService} from '../user/user.service'

@Resolver('notification')
export class NotificationResolver {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}

  
}

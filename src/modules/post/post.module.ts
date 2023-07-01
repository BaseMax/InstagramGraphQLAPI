import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';

@Module({
  providers: [PostService, PostResolver],
  exports: [PostService],
  imports: [PrismaModule, UserModule],
})
export class PostModule {}

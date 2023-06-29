import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [AuthService],
  imports: [ConfigModule, JwtModule, PrismaModule],
})
export class AuthModule {}

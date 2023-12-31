import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const c = ctx.getContext();
    if (c.req.headers.authorization) {
      const token = c.req.headers?.authorization?.split(' ')[1];
      if (!token) {
        throw new UnauthorizedException('invalid token');
      }
      try {
        c.req.user = this.jwtService.verify(token);
      } catch {
        throw new UnauthorizedException('invalid token');
      }
    }
    return true;
  }
}

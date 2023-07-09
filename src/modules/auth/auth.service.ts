import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegistrationUserInput } from './dto/register.input';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginUserInput } from './dto/login.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  async register(userRegInput: RegistrationUserInput) {
    const userFoundWithUsername = await this.userService.findUserByUserName(
      userRegInput.username,
    );
    if (!userFoundWithUsername) {
      throw new BadRequestException('user already exists with this username');
    }
    const userFoundWithPassword = await this.userService.findUserByPhoneNumber(
      userRegInput.phonenumber,
    );
    if (!userFoundWithPassword) {
      throw new BadRequestException(
        'user already exists with this phonenumber',
      );
    }
    const hashedPassword = await bcrypt.hash(
      userRegInput.password,
      parseInt(this.configService.get<string>('SALT_ROUND')),
    );

    const userCreated = await this.prismaService.user.create({
      data: { ...userRegInput, password: hashedPassword },
    });
    const token = await this.assignToken(userCreated);
    return { userCreated, token };
  }

  async login(userLoginInput: LoginUserInput) {
    const userFound = await this.userService.findUserByUserName(
      userLoginInput.username,
    );
    if (!userFound) {
      throw new BadRequestException('there is no user with this username');
    }
    const checked = await this.checkPassword(
      userLoginInput.password,
      userFound.password,
    );
    if (!checked) {
      throw new BadRequestException('password incorrect');
    }
    const token = await this.assignToken(userFound);
    return { userFound, token };
  }

  async resetPassword(userResetInput: ResetPasswordInput) {
    if (userResetInput.newPassword !== userResetInput.passwordConfirm) {
      throw new BadRequestException('password do not match');
    }
    const userFound = await this.userService.findUserByUserNameOrPhoneNumber(
      userResetInput.username,
      userResetInput.phonenumber,
    );
    const hashedNewPassword = await this.hashingPassword(userFound.password);
    const userRecovery = await this.prismaService.user.update({
      where: {
        phonenumber: userFound.phonenumber,
        username: userFound.username,
      },
      data: {
        ...userFound,
        password: hashedNewPassword,
      },
    });
    const token = await this.assignToken(userRecovery);
    return { userRecovery, token };
  }

  async hashingPassword(password: string): Promise<string> {
    return await bcrypt.hash(
      password,
      parseInt(this.configService.get<string>('SALT_ROUND')),
    );
  }

  async assignToken(user: User): Promise<String> {
    const token = this.jwtService.sign({
      id: user.id,
      username: user.username,
    });
    return token;
  }
  async checkPassword(
    passwordPassed: string,
    userFoundPassword: string,
  ): Promise<Boolean | undefined> {
    const checked = await bcrypt.compare(passwordPassed, userFoundPassword);
    return checked;
  }
}

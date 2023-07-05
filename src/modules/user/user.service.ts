import {
  BadGatewayException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async getAllUsers() {
    const users = await this.prismaService.user.findMany();
  }

  async getUserProfile(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new BadRequestException('there is no user with this id');
    }
    return user;
  }

  async updateUser(user: UpdateUserInput) {
    const userFound = await this.findUserByUserNameOrPhoneNumber(
      user.username,
      user.phonenumber,
    );
    const userUpdated = await this.prismaService.user.update({
      where: {
        id: userFound.id,
      },
      data: {
        ...userFound,
        bio: user.bio,
        name: user.name,
        username: user.username,
      },
    });
    return userUpdated;
  }

  async deleteUser(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      throw new BadGatewayException('there is no user with this id');
    }

    const deletedUser = await this.prismaService.user.delete({
      where: {
        id: id,
      },
    });
    return deletedUser;
  }

  async followUser(ToFollowId: number, wantFollowId: number): Promise<User[]> {
    //first we should make sure user with this id exists
    const wantToFollow = await this.findUserById(ToFollowId);
    const userRequestingForFollow = await this.findUserById(wantFollowId);
    //then we will retrieve it from db
    //then we add that user to lsit of following of the user requesting
    const updatedUser = await this.prismaService.user.update({
      where: {
        id: wantFollowId,
      },
      data: {
        following: {
          connect: {
            id: ToFollowId,
          },
        },
      },
    });

    const updatedFollowedUser = await this.prismaService.user.update({
      where: {
        id: ToFollowId,
      },
      data: {
        followedBy: {
          connect: {
            id: wantFollowId,
          },
        },
      },
    });
    return [updatedUser, updatedFollowedUser];
  }

  async listFollowers(id: number): Promise<User[]> {
    const userFound = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      include: {
        followedBy: true,
        following: true,
      },
    });
    if (!userFound) {
      throw new BadRequestException('theres no user with this id');
    }
    return userFound.following;
  }

  async listFollowingBy(id: number): Promise<User[]> {
    const userFound = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      include: {
        followedBy: true,
        following: true,
      },
    });

    if (!userFound) {
      throw new BadRequestException('theres no user with this id');
    }

    return userFound.followedBy;
  }

  async findUserByUserName(username: string): Promise<User | undefined | null> {
    if (!username) {
      throw new BadRequestException('invalid username provided');
    }
    const userFound = await this.prismaService.user.findUnique({
      where: {
        username: username,
      },
    });
    return userFound;
  }

  async findUserByPhoneNumber(
    phonenumber: string,
  ): Promise<User | undefined | null> {
    if (!phonenumber) {
      throw new BadRequestException('invalid phonenumber provided');
    }
    const userFound = await this.prismaService.user.findUnique({
      where: {
        phonenumber: phonenumber,
      },
    });
    return userFound;
  }

  async findUserByUserNameOrPhoneNumber(
    username: string,
    phonenumber: string,
  ): Promise<User | undefined> {
    if (!username && !phonenumber) {
      throw new BadRequestException('username and phonenumber are inavlid');
    }
    const userFound = await this.prismaService.user.findUniqueOrThrow({
      where: {
        username: username,
      },
    });
    return userFound;
  }

  async findUserById(id: number): Promise<User | undefined> {
    if (!id) {
      throw new BadRequestException('id is invalid');
    }
    const userFound = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      include: {
        following: true,
        followedBy: true,
        posts: true,
      },
    });
    if (!userFound) {
      throw new BadRequestException('user with provided id did not found');
    }
    return userFound;
  }

  async getByUserName(username: string) {
    if (!username) {
      throw new BadRequestException('invalid name provided');
    }
    const userFound = await this.prismaService.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!userFound) {
      throw new BadRequestException('there is no user with this username');
    }
    return userFound;
  }
}

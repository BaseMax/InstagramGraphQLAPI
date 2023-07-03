import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { CreatePostInput } from './dto/create-post.input';
import { Post } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(
    private prismaService: PrismaService,
    private userService: UserService,
  ) {}
  async createPost(input: CreatePostInput): Promise<Post | undefined> {
    const userFound = await this.userService.findUserById(input.userId);
    const createdPost = await this.prismaService.post.create({
      data: {
        title: input.title,
        body: input.body,
        likes: 0,
        User: { connect: { id: input.userId } },
      },
    });
    return createdPost;
  }

  async getPostById(id: number): Promise<Post | undefined> {
    if (!id) {
      throw new BadRequestException('invalid post id provided');
    }
    const postFound = await this.prismaService.post.findUnique({
      where: {
        id: id,
      },
    });
    return postFound;
  }

  async retrieveUsersPosts(id: number): Promise<Post[]> {
    if (!id) {
      throw new BadRequestException('invalid user id provided');
    }
    const userFound = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      include: { following: { include: { posts: true } } },
    });

    const feedPosts: Post[] = [];
    userFound.following.forEach((userFollow) => {
      userFollow.posts.forEach((post) => {
        feedPosts.push(post);
      });
    });
    return feedPosts;
  }

  async likePost(userId: number, postId: number): Promise<Post> {
    const userFound = await this.userService.findUserById(userId);
    const postFound = await this.prismaService.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        likedBy: true,
      },
    });
    let likedBefore: Boolean = false;
    postFound.likedBy.forEach((user) => {
      if (user.id === userFound.id) {
        likedBefore = true;
      }
    });
    let postUpdated: Post = null;
    if (!likedBefore) {
      postUpdated = await this.prismaService.post.update({
        where: {
          id: postId,
        },
        data: {
          likes: postFound.likes + 1,
          likedBy: {
            connect: { id: userFound.id },
          },
        },
      });
    } else {
      throw new BadRequestException('you already have liked the post');
    }
    return postUpdated;
  }

  async unlikePost(userId: number, postId: number): Promise<Post> {
    const userFound = await this.userService.findUserById(userId);
    const postFound = await this.prismaService.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        likedBy: true,
      },
    });
    let likedBefore: Boolean = false;
    postFound.likedBy.forEach((user) => {
      if (user.id === userFound.id) {
        likedBefore = true;
      }
    });
    let postUpdated: Post = null;
    if (likedBefore) {
      postUpdated = await this.prismaService.post.update({
        where: {
          id: postId,
        },
        data: {
          likes: postFound.likes - 1,
          likedBy: {
            disconnect: { id: userFound.id },
          },
        },
      });
    } else {
      throw new BadRequestException('you havnt liked the post');
    }
    return postUpdated;
  }

  async commentOnPost(
    postId: number,
    userId: number,
    text: string,
  ): Promise<Post> {
    const userFound = await this.userService.findUserById(userId);
    const postFound = await this.getPostById(postId);
    const commentCreated = await this.prismaService.comment.create({
      data: {
        text: text,
        userId: userId,
        postId: postId,
      },
    });
    const updatedPost = await this.prismaService.post.update({
      where: {
        id: postId,
      },
      data: {
        comments: { connect: { id: commentCreated.id } },
      },
    });
    return updatedPost;
  }

  async deletePost(id: number, userId: number): Promise<Post> {
    const userFound = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        posts: true,
      },
    });
    const postFound = await this.getPostById(id);
    if (!postFound) {
      throw new BadRequestException('post did not found');
    }
    let isChecked: Boolean = false;
    userFound.posts.forEach((post) => {
      if (post.id === id) isChecked = true;
    });
    let postDeleted: Post = null;
    if (isChecked) {
      postDeleted = await this.prismaService.post.delete({
        where: {
          id: id,
        },
      });
    } else {
      throw new BadRequestException(
        'you are not owner of this post and cannot delete it',
      );
    }
    return postDeleted;
  }

  async retrievePopularPosts() {
    const { startOfDay, endOfDay } = await this.getStartAndEndOfDay();

    const posts = await this.prismaService.post.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        likes: 'desc',
      },
    });
    return posts;
  }

  async getStartAndEndOfDay() {
    const currentDate = new Date();
    const startOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
    );
    const endOfDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1,
    );

    return { startOfDay, endOfDay };
  }

  async searchBasedOnHashTags(hashtags: string[]): Promise<Post[]> {
    console.log('hashtags: ', hashtags);
    const posts = await this.prismaService.post.findMany({
      where: {
        OR: hashtags.map((hashtag) => ({
          body: { contains: hashtag },
        })),
      },
    });
    return posts;
  }
}

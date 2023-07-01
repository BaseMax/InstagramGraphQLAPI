import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Post } from './post.model';
import { PostService } from './post.service';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { ParseIntPipe } from '@nestjs/common';

@Resolver(() => Post)
export class PostResolver {
  constructor(private postService: PostService) {}

  @Query(() => [Post])
  async getAllPosts() {}

  @Query(() => Post)
  async getPost(@Args('id', ParseIntPipe) id: number) {
    return await this.postService.getPostById(id);
  }

  @Mutation(() => Post)
  async createPost(@Args('input') input: CreatePostInput) {
    return await this.postService.createPost(input);
  }

  @Query(() => [Post])
  async RetrieveUsersPosts(@Args('id', ParseIntPipe) id: number) {
    return await this.postService.retrieveUsersPosts(id);
  }

  @Mutation(() => Post)
  async likePost(
    @Args('userId', ParseIntPipe) userId: number,
    @Args('postId', ParseIntPipe) postId: number,
  ) {
    return await this.postService.likePost(userId, postId);
  }

  @Mutation(() => Post)
  async unlikePost(
    @Args('userId', ParseIntPipe) userId: number,
    @Args('postId', ParseIntPipe) postId: number,
  ) {
    return await this.postService.unlikePost(userId, postId);
  }

  @Mutation(() => Post)
  async commentOnPost(
    @Args('postId', ParseIntPipe) postId: number,
    @Args('userId', ParseIntPipe) userId: number,
    @Args('text') text: string,
  ) {
    return await this.postService.commentOnPost(postId, userId, text);
  }

  @Mutation(() => Post)
  async deletePost(
    @Args('id', ParseIntPipe) id: number,
    @Args('userId', ParseIntPipe) userId: number,
  ) {
    return await this.postService.deletePost(id, userId);
  }

  @Mutation(() => Post)
  async updatePost(@Args('input') input: UpdatePostInput) {}

  @Query(() => [Post])
  async retrievePopularPosts() {
    return await this.postService.retrievePopularPosts();
  }
}

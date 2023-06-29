import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Post } from './post.model';
import { PostService } from './post.service';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';

@Resolver(() => Post)
export class PostResolver {
  constructor(private postService: PostService) {}

  @Query(() => [Post])
  async getAllPosts() {}

  @Query(() => Post)
  async getPost(@Args('id') id: string) {}

  @Mutation(() => Post)
  async createPost(@Args('input') input: CreatePostInput) {}

  @Mutation(() => Post)
  async updatePost(@Args('input') input: UpdatePostInput) {}

  @Mutation(() => Post)
  async deletePost() {}
}

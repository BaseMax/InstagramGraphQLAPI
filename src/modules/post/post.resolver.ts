import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Post } from './post.model';
import { PostService } from './post.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(private postService: PostService) {}

  @Query(() => [Post])
  async getAllPosts() {}

  @Query(() => Post)
  async getPost(@Args('id') id: string) {}
  
}

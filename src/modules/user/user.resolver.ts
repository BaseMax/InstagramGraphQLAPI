import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './user.service';
import { UpdateUserInput } from './dto/update-user.input';
import { ParseIntPipe } from '@nestjs/common';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}
  @Query(() => [User])
  async getAllUsers() {
    // return this.userService.
  }

  @Query(() => User, { nullable: true })
  async getUserProfile(@Args('id', ParseIntPipe) id: number) {
    return this.userService.getUserProfile(id);
  }

  @Mutation(() => User)
  async updateUser(@Args('input') input: UpdateUserInput) {
    return this.userService.updateUser(input);
  }

  @Mutation(() => User)
  async deleteUser(@Args('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }

  @Mutation(() => [User])
  async followUser(
    @Args('ToFollowId', ParseIntPipe) ToFollowId: number,
    @Args('wantFollowId', ParseIntPipe) wantFollowId: number,
  ) {
    return await this.userService.followUser(ToFollowId, wantFollowId);
  }

  @Query(() => [User])
  async listFollowers(@Args('id', ParseIntPipe) id: number) {
    return await this.userService.listFollowers(id);
  }

  @Query(() => [User])
  async listFollowedBy(@Args('id', ParseIntPipe) id: number) {
    return await this.userService.listFollowingBy(id);
  }
}

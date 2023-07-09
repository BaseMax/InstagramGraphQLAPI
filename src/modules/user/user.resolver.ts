import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}
  @Query(() => [User])
  async getAllUsers() {
    // return this.userService.
  }

  @Query(() => User, { nullable: true })
  async getUser(@Args('id') id: string) {
    // return this.userService
  }

  @Mutation(() => User)
  async createUser(@Args('input') input: CreateUserInput) {}

  @Mutation(() => User)
  async updateUser(@Args('input') input: UpdateUserInput) {}

  @Mutation(() => User)
  async deleteUser() {}
}

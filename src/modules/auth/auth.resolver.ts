import { Resolver, Mutation, Context, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthPayLoad } from './dto/auth-payload';
import { RegistrationUserInput } from './dto/register.input';
import { LoginUserInput } from './dto/login.input';
import { ResetPasswordInput } from './dto/reset-password.input';
import { Auth } from './auth.model';
import { HttpException } from '@nestjs/common';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private userService: UserService, private service: AuthService) {}

  @Mutation(() => Auth)
  async userRegister(
    @Context() ctx: any,
    @Args('input') input: RegistrationUserInput,
  ) {
    try {
      const { userCreated, token } = await this.service.register(input);
      ctx.req.user = userCreated;
      return { token, ...userCreated };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Mutation(() => Auth)
  async userLogin(@Context() ctx: any, @Args('input') input: LoginUserInput) {
    const { userFound, token } = await this.service.login(input);
    ctx.req.user = userFound;
    return { ...userFound, token };
  }

  @Mutation(() => Auth)
  async userLogOut(@Args('id') id: number) {
    const userFound = await this.service.userLogOut(id);
    return { ...userFound, token: '' };
  }

  @Mutation(() => Auth)
  async ResetPassword(
    @Context() ctx: any,
    @Args('input') input: ResetPasswordInput,
  ) {
    const { userRecovery, token } = await this.service.resetPassword(input);
    ctx.req.user = userRecovery;
    return { ...userRecovery, token };
  }
}

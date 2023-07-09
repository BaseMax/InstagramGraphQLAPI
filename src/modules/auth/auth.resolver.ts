import { Resolver, Mutation, Context, Args } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthPayLoad } from './dto/auth-payload';
import { RegistrationUserInput } from './dto/register.input';
import { LoginUserInput } from './dto/login.input';
import { ResetPasswordInput } from './dto/reset-password.input';

@Resolver('auth')
export class AuthResolver {
  constructor(private userService: UserService, private service: AuthService) {}

  @Mutation(() => AuthPayLoad)
  async userRegister(
    @Context() ctx: any,
    @Args({ name: 'input', type: () => AuthPayLoad })
    input: RegistrationUserInput,
  ) {
    const { userCreated, token } = await this.service.register(input);
    ctx.req.user = userCreated;
    return { token, userCreated };
  }

  @Mutation(() => AuthPayLoad)
  async userLogin(
    @Context() ctx: any,
    @Args({ name: 'input', type: () => AuthPayLoad }) input: LoginUserInput,
  ) {
    const { userFound, token } = await this.service.login(input);
    ctx.req.user = userFound;
    return { userFound, token };
  }

  @Mutation(() => AuthPayLoad)
  async userLogOut() {
    return true;
  }

  @Mutation(() => AuthPayLoad)
  async ResetPassword(
    @Context() ctx: any,
    @Args({ name: 'input', type: () => AuthPayLoad }) input: ResetPasswordInput,
  ) {
    const { userRecovery, token } = await this.service.resetPassword(input);
    ctx.req.user = userRecovery;
  }
}

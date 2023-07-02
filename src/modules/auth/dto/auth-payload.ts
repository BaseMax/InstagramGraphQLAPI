import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class AuthPayLoad {
  @IsString()
  @Field()
  username: string;

  @IsString()
  @Field()
  password: string;
}

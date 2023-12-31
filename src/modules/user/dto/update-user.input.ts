import { Field, InputType } from '@nestjs/graphql';
import { Length, IsString, IsOptional } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @IsString()
  @Field()
  @Length(3, 40)
  name: string;

  @IsString()
  @Field()
  @Length(3, 40)
  username: string;

  @IsString()
  @Field()
  @Length(6, 100)
  password: string;

  @IsString()
  @Field()
  phonenumber: string;

  @IsOptional()
  @IsString()
  @Field()
  bio: string;
}

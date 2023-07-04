import { Field, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';

@ObjectType('Auth')
export class Auth {
  @IsString()
  @Field()
  username: string;

  @IsString()
  @Field()
  bio: string;

  @IsString()
  @Field()
  status: string;

  @IsString()
  @Field()
  phonenumber: string;

  @IsString()
  @Field()
  token: string;

  @IsNumber()
  @Field()
  id: number;
}

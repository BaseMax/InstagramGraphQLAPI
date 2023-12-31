import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class CreatePostInput {
  @Length(3, 300)
  @Field()
  body: string;

  @Length(3, 40)
  @Field()
  title: string;

  @Field()
  userId: number;
}

import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class UpdatePostInput {
  @Length(1, 20)
  @Field()
  title: string;
}

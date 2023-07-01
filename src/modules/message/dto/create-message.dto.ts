import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class CreateMessageInput {
  @Length(3, 300)
  @Field()
  body: string;

  @Field()
  senderId: number;

  @Field()
  reciptientId: number;
}

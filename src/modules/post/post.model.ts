import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Message } from '../message/message.model';
import { User } from '../user/user.model';

@ObjectType('post')
export class Post {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field()
  body: string;

  @Field(() => [Message])
  comments: Message[];

  @Field(() => User)
  user: User;

  @Field(() => ID)
  userId: number;

  @Field()
  likes: number;
}

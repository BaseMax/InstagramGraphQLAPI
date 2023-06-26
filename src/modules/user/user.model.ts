import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Post } from '../post/post.model';
import { Message } from '../message/message.model';

@ObjectType()
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  username: string;

  @Field()
  password: string;

  @Field()
  phonenumber: number;

  @Field()
  bio: string;

  @Field()
  status: string;

  @Field(() => [Post])
  posts: Post[];

  @Field(() => [Message])
  messages: Message[];

  @Field(() => [Notification])
  notifications: Notification[];
}

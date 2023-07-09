import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Post } from '../post/post.model';
import { Message } from '../message/message.model';
import { Notification } from '../notification/notification.model';

@ObjectType('user')
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
  phonenumber: string;

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

  @Field(() => [User])
  following: User[];

  @Field(() => [User])
  followedBy: User[];
}

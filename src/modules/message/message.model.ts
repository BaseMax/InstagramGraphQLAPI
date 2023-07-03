import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Post } from '../post/post.model';
import { User } from '../user/user.model';

@ObjectType('message')
export class Message {
  @Field(() => ID)
  id: number;

  @Field()
  read: boolean;

  @Field()
  body: string;

  @Field(() => User)
  sender: User;

  @Field(() => ID)
  senderId: number;

  @Field(() => User)
  reciptient: User;

  @Field(() => ID)
  reciptientId: number;

  @Field(() => Post)
  post: Post;

  @Field(() => ID)
  postId: number;

  @Field(() => Int)
  seen: number;
}

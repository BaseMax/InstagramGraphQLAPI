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
  user: User;

  @Field(() => ID)
  userId: number;

  @Field(() => Post)
  post: Post;

  @Field(() => ID)
  postId: number;

  @Field(() => Int)
  seen: number;
}

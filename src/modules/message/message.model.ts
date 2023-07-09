import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Post } from '../post/post.model';
import { User } from '../user/user.model';

@ObjectType()
export class Message {
  @Field(() => ID)
  id: number;

  @Field()
  read: boolean;

  @Field()
  body: string;

  @Field(() => User)
  user: User;
  userId: String;

  @Field(() => Post)
  post: Post;
  postId: String;
}

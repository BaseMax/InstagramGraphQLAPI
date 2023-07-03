import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../user/user.model';

@ObjectType('post')
export class Post {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field()
  body: string;

  @Field(() => [Comment])
  comments: Comment[];

  @Field()
  likes: number;

  @Field(() => [User])
  likedBy: User[];

  @Field(() => ID)
  userId: number;
}

@ObjectType('comment')
export class Comment {
  @Field(() => ID)
  id: number;

  @Field()
  text: string;

  @Field()
  postId: number;

  @Field(() => ID)
  userId: number;
}

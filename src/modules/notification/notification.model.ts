import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from '../user/user.model';

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: number;

  @Field()
  title: string;

  @Field()
  body: string;

  @Field()
  status: string;

  @Field()
  user: User;
  userId: String;
}

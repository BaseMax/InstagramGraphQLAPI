import { IsString, IsNotEmpty, IsNumber, IsDate } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateNotificationTokenDto {
  @IsNumber()
  @IsNotEmpty()
  @Field()
  userId: number;

  @IsString()
  @Field()
  device_type: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  notification_token: string;
}

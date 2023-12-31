import { IsString, IsNotEmpty, IsNumber, IsDate } from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateNotificationDto {
  @IsNumber()
  @IsNotEmpty()
  @Field()
  userId: number;

  @IsString()
  @IsNotEmpty()
  @Field()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Field()
  body: string;

  @IsString()
  @Field()
  device_type: string;

  @IsString()
  @Field()
  notification_token: string;
}

import { IsString, IsNotEmpty, IsNumber, IsDate } from 'class-validator';
export class CreateNotificationDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  device_type: string;

  @IsString()
  notification_token: string;
}

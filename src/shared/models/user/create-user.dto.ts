import { UserType } from '../../types/user-type.enum.js';
import { IsEmail, IsString, IsEnum, Length, Matches } from 'class-validator';

export class CreateUserDTO {
  @IsEmail({}, { message: 'email must be a valid email address' })
  public email!: string;

  @IsString({ message: 'name is required' })
  @Length(1, 15, { message: 'name must be between 1 and 15 characters' })
  public name!: string;

  @IsString({ message: 'lastName is required' })
  @Length(1, 15, { message: 'lastName must be between 1 and 15 characters' })
  public lastName!: string;

  @IsString({ message: 'password is required' })
  @Length(6, 12, { message: 'password must be between 6 and 12 characters' })
  public password!: string;

  @IsString({ message: 'avatarUrl is required' })
  @Matches(/\.(jpg|png)$/i, { message: 'avatarUrl must be a jpg or png image' })
  public avatarUrl!: string;

  @IsEnum(UserType, { message: 'type must be either common or pro' })
  public type!: UserType;
}

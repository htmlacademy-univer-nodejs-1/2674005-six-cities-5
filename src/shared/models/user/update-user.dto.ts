import { UserType } from '../../types/user-type.enum.js';
import { IsString, IsEnum, Length, Matches, IsOptional } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @IsString({ message: 'name must be a string' })
  @Length(1, 15, { message: 'name must be between 1 and 15 characters' })
  public name?: string;

  @IsOptional()
  @IsString({ message: 'lastName must be a string' })
  @Length(1, 15, { message: 'lastName must be between 1 and 15 characters' })
  public lastName?: string;

  @IsOptional()
  @IsString({ message: 'avatarUrl must be a string' })
  @Matches(/\.(jpg|png)$/i, { message: 'avatarUrl must be a jpg or png image' })
  public avatarUrl?: string;

  @IsOptional()
  @IsEnum(UserType, { message: 'type must be either common or pro' })
  public type?: UserType;
}

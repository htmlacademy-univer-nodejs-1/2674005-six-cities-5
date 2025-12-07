import { IsEmail, IsString, Length } from 'class-validator';

export class LoginUserDTO {
  @IsEmail({}, { message: 'email must be a valid email address' })
  public email!: string;

  @IsString({ message: 'password is required' })
  @Length(6, 12, { message: 'password must be between 6 and 12 characters' })
  public password!: string;
}

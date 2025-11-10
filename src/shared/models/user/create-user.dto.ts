import { UserType } from '../../types/user-type.enum.js';

export class CreateUserDTO {
  public email!: string;
  public name!: string;
  public lastName!: string;
  public password!: string;
  public avatarUrl!: string;
  public type!: UserType;
}

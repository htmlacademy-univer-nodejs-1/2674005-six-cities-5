import { UserType } from '../../types/user-type.enum.js';

export class UpdateUserDTO {
  public name?: string;
  public lastName?: string;
  public avatarUrl?: string;
  public type?: UserType;
}

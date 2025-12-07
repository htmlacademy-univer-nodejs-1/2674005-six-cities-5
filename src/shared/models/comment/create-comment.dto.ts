import { IsString, IsInt, Min, Max, Length } from 'class-validator';

export class CreateCommentDTO {
  @IsString({ message: 'text is required' })
  @Length(5, 1024, { message: 'text must be between 5 and 1024 characters' })
  public text!: string;

  @IsInt({ message: 'rating must be an integer' })
  @Min(1, { message: 'rating must be at least 1' })
  @Max(5, { message: 'rating must be at most 5' })
  public rating!: number;

  @IsString({ message: 'offerId is required' })
  public offerId!: string;

  public userId?: string;
}

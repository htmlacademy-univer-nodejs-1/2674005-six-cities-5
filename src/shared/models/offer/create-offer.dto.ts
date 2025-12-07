import { City } from '../../types/city.enum.js';
import { HousingType } from '../../types/housing-type.enum.js';
import { IsString, IsEnum, IsBoolean, IsInt, IsArray, ArrayMinSize, ArrayMaxSize, Min, Max, Length, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class Location {
  @IsNumber()
  public latitude!: number;

  @IsNumber()
  public longitude!: number;
}

export class CreateOfferDTO {
  @IsString({ message: 'title is required' })
  @Length(10, 100, { message: 'title must be between 10 and 100 characters' })
  public title!: string;

  @IsString({ message: 'description is required' })
  @Length(20, 1024, { message: 'description must be between 20 and 1024 characters' })
  public description!: string;

  @IsEnum(City, { message: 'city must be a valid city' })
  public city!: City;

  @IsString({ message: 'previewImage is required' })
  public previewImage!: string;

  @IsArray({ message: 'images must be an array' })
  @ArrayMinSize(6, { message: 'images must contain exactly 6 items' })
  @ArrayMaxSize(6, { message: 'images must contain exactly 6 items' })
  @IsString({ each: true, message: 'each image must be a string' })
  public images!: string[];

  @IsBoolean({ message: 'isPremium must be a boolean' })
  public isPremium!: boolean;

  @IsEnum(HousingType, { message: 'type must be a valid housing type' })
  public type!: HousingType;

  @IsInt({ message: 'rooms must be an integer' })
  @Min(1, { message: 'rooms must be at least 1' })
  @Max(8, { message: 'rooms must be at most 8' })
  public rooms!: number;

  @IsInt({ message: 'guests must be an integer' })
  @Min(1, { message: 'guests must be at least 1' })
  @Max(10, { message: 'guests must be at most 10' })
  public guests!: number;

  @IsInt({ message: 'price must be an integer' })
  @Min(100, { message: 'price must be at least 100' })
  @Max(100000, { message: 'price must be at most 100000' })
  public price!: number;

  @IsArray({ message: 'amenities must be an array' })
  @IsString({ each: true, message: 'each amenity must be a string' })
  public amenities!: string[];

  @IsString({ message: 'userId is required' })
  public userId!: string;

  @ValidateNested()
  @Type(() => Location)
  public location!: Location;
}

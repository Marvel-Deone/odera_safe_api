import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  Max,
  Min,
} from 'class-validator'

export class CreateGuardLocationDto {
  @IsLatitude()
  latitude!: number

  @IsLongitude()
  longitude!: number

  @IsOptional()
  @IsNumber()
  speed?: number

  @IsOptional()
  @IsNumber()
  heading?: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  batteryLevel?: number
}
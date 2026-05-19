
import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator'
import { GuardSOSCategory } from '@prisma/client'

export class CreateGuardSOSDto {
  @IsEnum(GuardSOSCategory)
  category!: GuardSOSCategory

  @IsOptional()
  @IsString()
  zone?: string

  @IsOptional()
  @IsString()
  message?: string

  @IsOptional()
  @IsNumber()
  latitude?: number

  @IsOptional()
  @IsNumber()
  longitude?: number
}

export class ResolveGuardSOSDto {
  @IsOptional()
  @IsString()
  resolutionNote?: string
}
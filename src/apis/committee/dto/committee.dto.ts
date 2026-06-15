import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class CreateCommitteeDto {
  @ApiProperty({
    example: 'Security Committee',
  })
  @IsString()
  name!: string

  @ApiProperty({
    example:
      'Handles estate security matters',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string
}
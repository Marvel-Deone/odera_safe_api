import { ApiProperty } from '@nestjs/swagger'
import { AnnouncementAudience, AnnouncementCategory } from '@prisma/client'
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator'

export class CreateAnnouncementDto {
  @ApiProperty()
  @IsString()
  title!: string

  @ApiProperty()
  @IsString()
  body!: string

  @ApiProperty({
    enum: AnnouncementCategory,
  })
  @IsEnum(AnnouncementCategory)
  category!: AnnouncementCategory

  @ApiProperty({
    enum: AnnouncementAudience,
  })
  @IsEnum(AnnouncementAudience)
  audience!: AnnouncementAudience

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  sendSms?: boolean
}

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  comment!: string
}
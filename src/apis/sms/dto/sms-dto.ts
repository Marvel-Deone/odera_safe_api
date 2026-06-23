import {
  ApiProperty,
} from '@nestjs/swagger'

import {
  IsString,
} from 'class-validator'

export class SendSmsDto {
  @ApiProperty({
    example:
      '08012345678',
  })
  @IsString()
  phone!: string

  @ApiProperty({
    example:
      'Hello from DD Safe',
  })
  @IsString()
  message!: string
}
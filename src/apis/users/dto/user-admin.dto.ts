import { ApiProperty } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { IsEmail, IsEnum } from 'class-validator'

export class CreateAdminUserDto {
  @ApiProperty({
    example: 'admin@example.com',
  })
  @IsEmail()
  email!: string

  @ApiProperty({
    enum: [Role.ADMIN, Role.SUPER_ADMIN],
    example: Role.ADMIN,
  })
  @IsEnum(Role)
  role!: Role
}

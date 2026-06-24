import { HttpStatus, Injectable } from '@nestjs/common'
import { Role } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../../database/prisma/prisma.service'
import { error, success } from '../../common/utils/response.util'
import { CreateAdminUserDto } from './dto/user-admin.dto'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createAdminUser(currentUserId: string, dto: CreateAdminUserDto) {
    const creatableRoles: Role[] = [Role.ADMIN, Role.SUPER_ADMIN]

    if (!creatableRoles.includes(dto.role)) {
      return error(
        'Invalid Role',
        'Only ADMIN or SUPER_ADMIN users can be created from this endpoint',
        HttpStatus.BAD_REQUEST,
      )
    }

    const superAdmin = await this.prisma.user.findUnique({
      where: { id: currentUserId },
    })

    if (!superAdmin) {
      return error('Not Found', 'Current user not found', HttpStatus.NOT_FOUND)
    }

    if (superAdmin.role !== Role.SUPER_ADMIN) {
      return error(
        'Forbidden',
        'Only Super Admin can create admin users',
        HttpStatus.FORBIDDEN,
      )
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    })

    if (existingUser) {
      return error(
        'Duplicate Error',
        'A user with this email already exists',
        HttpStatus.BAD_REQUEST,
      )
    }

    const tempPassword = Math.random().toString(36).slice(-10)
    const hashedPassword = await bcrypt.hash(tempPassword, 10)

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
        first_login: true,
        estateId: superAdmin.estateId,
      },
    })
    const { password, ...safeUser } = user

    return success(
      {
        user: safeUser,
        tempPassword,
      },
      'Admin User Created',
      'Admin user created successfully',
      HttpStatus.CREATED,
    )
  }
}

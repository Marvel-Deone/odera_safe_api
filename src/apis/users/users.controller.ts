import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { Roles } from '../auth/decorators/roles.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { CreateAdminUserDto } from './dto/user-admin.dto'
import { UsersService } from './users.service'

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('admins')
  @Roles(Role.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create admin or super admin user',
    description:
      'Super Admin can create ADMIN and SUPER_ADMIN accounts for the same estate. The new user is created with first_login=true and a temporary password.',
  })
  @ApiBody({ type: CreateAdminUserDto })
  @ApiResponse({
    status: 201,
    description: 'Admin user created successfully',
    schema: {
      example: {
        statusCode: 201,
        status: 'success',
        title: 'Admin User Created',
        message: 'Admin user created successfully',
        data: {
          user: {
            id: 'user-id',
            email: 'admin@example.com',
            role: 'ADMIN',
            first_login: true,
            estateId: 'estate-id',
          },
          tempPassword: 'abc123xyz',
        },
      },
    },
  })
  createAdminUser(
    @CurrentUser() user: any,
    @Body() dto: CreateAdminUserDto,
  ) {
    return this.usersService.createAdminUser(user.id, dto)
  }
}

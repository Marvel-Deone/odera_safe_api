import { Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { PrismaService } from '../../database/prisma/prisma.service';
import { SosRecipient, SosType } from './sos.types';

@Injectable()
export class SosRecipientService {
    constructor(private readonly prisma: PrismaService) {}

    private readonly rolesByType: Record<SosType, Role[]> = {
        [SosType.GUARD]: [Role.GUARD, Role.SUPER_GUARD, Role.ADMIN, Role.SUPER_ADMIN],
        [SosType.RESIDENT]: [Role.RESIDENT, Role.GUARD, Role.SUPER_GUARD, Role.ADMIN, Role.SUPER_ADMIN],
        [SosType.ADMIN]: [Role.SUPER_GUARD, Role.ADMIN, Role.SUPER_ADMIN],
    };

    async getRecipients(estateId: string, type: SosType): Promise<SosRecipient[]> {
        return this.prisma.user.findMany({
            where: { estateId, role: { in: this.rolesByType[type] } },
            select: { id: true, role: true, email: true },
        });
    }
}

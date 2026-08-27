import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../../database/prisma/prisma.service";
import { randomUUID } from "crypto";
import * as QRCode from 'qrcode';
import { error } from "../../common/utils/response.util";

@Injectable()
export class ResidentAssociateCredentialsService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

   async generateGateCredentials(): Promise<{
        passcode: string;
        qrPayload: string;
        qrCode: string;
    }> {
        for (let attempt = 0; attempt < 10; attempt++) {
            const passcode = Math.floor(
                100000 + Math.random() * 900000,
            ).toString();
            const qrPayload = `CO_RESIDENT:${randomUUID()}`;
            const existing = await this.prisma.residentAssociate.findFirst({
                where: { OR: [{ passcode }, { qrPayload }] },
                select: { id: true },
            });

            if (!existing) {
                return {
                    passcode,
                    qrPayload,
                    qrCode: await QRCode.toDataURL(qrPayload),
                };
            }
        }

        error(
            'Credential Error',
            'Unable to generate unique co-resident gate credentials',
            HttpStatus.INTERNAL_SERVER_ERROR,
        );

        return undefined!;
    }

   async ensureGateCredentials(associateId: string) {
        const associate = await this.prisma.residentAssociate.findUnique({
            where: { id: associateId },
            select: {
                passcode: true,
                qrPayload: true,
                qrCode: true,
            },
        });

        if (!associate) {
            error(
                'Not Found',
                'Co-resident profile not found',
                HttpStatus.NOT_FOUND,
            );
        }

        if (associate!.passcode && associate!.qrPayload && associate!.qrCode) {
            return associate!;
        }

        return this.prisma.residentAssociate.update({
            where: { id: associateId },
            data: await this.generateGateCredentials(),
            select: {
                passcode: true,
                qrPayload: true,
                qrCode: true,
            },
        });
    }
}
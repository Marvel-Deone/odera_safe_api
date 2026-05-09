import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
// import { PrismaClient } from '../../../generated/prisma';

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {

    private readonly pool: Pool;

    constructor() {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL environment variable is not set');
        }

        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });

        const adapter = new PrismaPg(pool);

        super({
            adapter,
            log: ['query', 'info', 'warn', 'error'],
        });

        this.pool = pool;
    }

    async onModuleInit() {
        await this.$connect();
        const db = await this.$queryRawUnsafe(
            `SELECT current_database(), current_schema()`
        );
    }

    async onModuleDestroy() {
        await this.$disconnect();
        await this.pool.end(); 
    }
}
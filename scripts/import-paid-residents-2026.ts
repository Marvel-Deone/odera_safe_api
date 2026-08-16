import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import {
    LevyCategory,
    LevyStatus,
    Prisma,
    PrismaClient,
    Role,
} from '@prisma/client';
import { Pool } from 'pg';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

type PaidResidentRow = {
    sourceRow: number;
    serialNumber?: string | null;
    name?: string | null;
    houseNo?: string | null;
    street?: string | null;
    category?: string | null;
    apartmentTypeLabel?: string | null;
    amount: number;
};

type Args = {
    data: string;
    mapping?: string;
    estateId?: string;
    commit: boolean;
    allowPartial: boolean;
    updateApartmentTypes: boolean;
    dueDate: string;
    paidAt: string;
};

const LEVY_PERIOD = '2026';
const LEVY_TITLE = '2026 Residential Levy';
const LEVY_DESCRIPTION = '2026 Residential Levy';

const APARTMENT_TYPE_IDS = {
    oneBedroom: '07e33120-4f9c-43cd-83ea-2aa368ffbb81',
    containerKiosk: '7919be34-ecf1-4dd7-8027-1129d5f3d000',
    selfContained: '9d5d51ff-9185-47a6-874e-1b709333f06c',
    shop: 'a3323f19-86b5-4878-9395-74f977ed5d3a',
    threeBedroom: 'ba27fe92-0e16-48d9-8795-397fc77159ef',
    duplex: 'cd2c765b-208d-4d6d-8616-0f78e8cd2c0f',
    wholeHouse: 'dec627b1-73bf-45de-bfa8-d660713fa36a',
    twoBedroom: 'f79d7105-679b-4dde-9a73-f84d9c56de33',
};

const APARTMENT_TYPE_PRICES = [
    { apartmentTypeId: APARTMENT_TYPE_IDS.oneBedroom, amount: 22000 },
    { apartmentTypeId: APARTMENT_TYPE_IDS.containerKiosk, amount: 7000 },
    { apartmentTypeId: APARTMENT_TYPE_IDS.selfContained, amount: 11000 },
    { apartmentTypeId: APARTMENT_TYPE_IDS.shop, amount: 40000 },
    { apartmentTypeId: APARTMENT_TYPE_IDS.threeBedroom, amount: 30000 },
    { apartmentTypeId: APARTMENT_TYPE_IDS.duplex, amount: 49000 },
    { apartmentTypeId: APARTMENT_TYPE_IDS.wholeHouse, amount: 79000 },
    { apartmentTypeId: APARTMENT_TYPE_IDS.twoBedroom, amount: 26000 },
];

function parseArgs(): Args {
    const args = process.argv.slice(2);
    const parsed: Args = {
        data: 'tmp/paid-residents-2026.json',
        commit: false,
        allowPartial: false,
        updateApartmentTypes: false,
        dueDate: '2026-07-31T23:59:59.000Z',
        paidAt: new Date().toISOString(),
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--commit') parsed.commit = true;
        else if (arg === '--allow-partial') parsed.allowPartial = true;
        else if (arg === '--update-apartment-types') {
            parsed.updateApartmentTypes = true;
        } else if (arg === '--data') parsed.data = args[++i];
        else if (arg === '--mapping') parsed.mapping = args[++i];
        else if (arg === '--estate-id') parsed.estateId = args[++i];
        else if (arg === '--due-date') parsed.dueDate = args[++i];
        else if (arg === '--paid-at') parsed.paidAt = args[++i];
        else if (arg === '--help') {
            console.log(`Usage:
  ts-node scripts/import-paid-residents-2026.ts --data tmp/paid-residents-2026.json [--estate-id id] [--commit]

Options:
  --commit                  Write changes to DB. Omit for dry-run.
  --mapping CSV             Optional reviewed CSV with sourceRow,residentId mappings.
  --allow-partial           Commit matched rows even if some rows are unmatched.
  --update-apartment-types  Set Resident.apartmentTypeId from spreadsheet labels.
  --due-date ISO_DATE       Levy due date. Default: ${parsed.dueDate}
  --paid-at ISO_DATE        Paid date. Default: now
`);
            process.exit(0);
        }
    }

    return parsed;
}

function normalize(value?: string | null) {
    return String(value ?? '')
        .toUpperCase()
        .replace(/&/g, ' AND ')
        .replace(/[^A-Z0-9]+/g, ' ')
        .replace(/\b(ST|STREET)\b/g, 'ST')
        .replace(/\b(APPT|APT|APP)\b/g, 'APARTMENT')
        .replace(/\s+/g, ' ')
        .trim();
}

function tokens(value?: string | null) {
    return normalize(value)
        .split(' ')
        .filter((token) => token.length > 1);
}

function parseCsvLine(line: string) {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const next = line[i + 1];

        if (char === '"' && inQuotes && next === '"') {
            current += '"';
            i++;
        } else if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(current);
            current = '';
        } else {
            current += char;
        }
    }

    values.push(current);
    return values;
}

function loadReviewedMappings(path?: string) {
    const mappings = new Map<number, string>();
    if (!path) return mappings;

    const lines = readFileSync(path, 'utf8')
        .split(/\r?\n/)
        .filter((line) => line.trim());

    if (lines.length <= 1) return mappings;

    const headers = parseCsvLine(lines[0]).map((header) => header.trim());
    const sourceRowIndex = headers.findIndex((header) =>
        ['sourceRow', 'source_row'].includes(header),
    );
    const residentIdIndex = headers.findIndex((header) =>
        ['residentId', 'resident_id', 'matchedResidentId'].includes(header),
    );

    if (sourceRowIndex === -1 || residentIdIndex === -1) {
        throw new Error(
            'Mapping CSV must include sourceRow and residentId columns.',
        );
    }

    for (const line of lines.slice(1)) {
        const values = parseCsvLine(line);
        const sourceRow = Number(values[sourceRowIndex]);
        const residentId = values[residentIdIndex]?.trim();
        if (sourceRow && residentId) mappings.set(sourceRow, residentId);
    }

    return mappings;
}

function tokenScore(source?: string | null, target?: string | null) {
    const sourceTokens = new Set(tokens(source));
    const targetTokens = new Set(tokens(target));
    if (!sourceTokens.size || !targetTokens.size) return 0;

    let overlap = 0;
    for (const token of sourceTokens) {
        if (targetTokens.has(token)) overlap++;
    }

    return overlap / Math.max(sourceTokens.size, targetTokens.size);
}

function apartmentTypeIdForLabel(label?: string | null) {
    const normalized = normalize(label);
    if (!normalized) return undefined;
    if (normalized.includes('SELF CONTAINED')) {
        return APARTMENT_TYPE_IDS.selfContained;
    }
    if (normalized.includes('CONTAINER') || normalized.includes('KIOSK')) {
        return APARTMENT_TYPE_IDS.containerKiosk;
    }
    if (normalized.includes('SHOP')) return APARTMENT_TYPE_IDS.shop;
    if (normalized.includes('FULL COMPOUND')) {
        return APARTMENT_TYPE_IDS.wholeHouse;
    }
    if (normalized.includes('WHOLE HOUSE')) {
        return APARTMENT_TYPE_IDS.wholeHouse;
    }
    if (normalized.includes('DUPLEX')) return APARTMENT_TYPE_IDS.duplex;
    if (normalized.includes('3 BEDROOM')) {
        return APARTMENT_TYPE_IDS.threeBedroom;
    }
    if (normalized.includes('2 BEDROOM')) {
        return APARTMENT_TYPE_IDS.twoBedroom;
    }
    if (normalized.includes('1 BEDROOM')) {
        return APARTMENT_TYPE_IDS.oneBedroom;
    }
    return undefined;
}

function scoreResident(row: PaidResidentRow, resident: any) {
    const rowHouse = normalize(row.houseNo);
    const residentHouse = normalize(resident.house_no);
    const rowStreet = normalize(row.street);
    const residentStreet = normalize(resident.street?.name);
    const rowName = normalize(row.name);
    const residentName = normalize(
        `${resident.first_name ?? ''} ${resident.last_name ?? ''}`,
    );

    let score = 0;
    const reasons: string[] = [];

    if (rowHouse && residentHouse && rowHouse === residentHouse) {
        score += 40;
        reasons.push('house');
    }

    if (rowStreet && residentStreet) {
        if (rowStreet === residentStreet) {
            score += 30;
            reasons.push('street-exact');
        } else if (
            rowStreet.includes(residentStreet) ||
            residentStreet.includes(rowStreet)
        ) {
            score += 20;
            reasons.push('street-partial');
        }
    }

    const nameScore = tokenScore(rowName, residentName);
    if (nameScore > 0) {
        score += Math.round(nameScore * 40);
        reasons.push(`name:${nameScore.toFixed(2)}`);
    }

    return { score, reasons };
}

function ensureOutputDir(path: string) {
    mkdirSync(dirname(path), { recursive: true });
}

async function main() {
    const args = parseArgs();
    const rows = JSON.parse(
        readFileSync(args.data, 'utf8'),
    ) as PaidResidentRow[];
    const reviewedMappings = loadReviewedMappings(args.mapping);

    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL environment variable is not set');
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

    try {
        const estateId =
            args.estateId ??
            (await prisma.estate.findMany({ select: { id: true } })).at(0)?.id;

        if (!estateId) throw new Error('No estate found. Pass --estate-id.');

        const estateCount = await prisma.estate.count();
        if (!args.estateId && estateCount > 1) {
            throw new Error(
                'Multiple estates found. Pass --estate-id to choose one.',
            );
        }

        const residents = await prisma.resident.findMany({
            where: { estateId },
            include: { street: true, apartmentType: true },
        });

        const apartmentTypeCount = await prisma.apartmentType.count({
            where: {
                estateId,
                id: {
                    in: APARTMENT_TYPE_PRICES.map(
                        (price) => price.apartmentTypeId,
                    ),
                },
            },
        });

        if (apartmentTypeCount !== APARTMENT_TYPE_PRICES.length) {
            throw new Error(
                'One or more supplied apartmentTypeIds do not belong to this estate.',
            );
        }

        const matched: any[] = [];
        const unmatched: any[] = [];
        const ambiguous: any[] = [];

        for (const row of rows) {
            const mappedResidentId = reviewedMappings.get(row.sourceRow);

            if (mappedResidentId) {
                const resident = residents.find(
                    (candidate) => candidate.id === mappedResidentId,
                );

                if (!resident) {
                    unmatched.push({
                        row,
                        reason: `mapped residentId ${mappedResidentId} does not belong to this estate`,
                    });
                    continue;
                }

                matched.push({
                    row,
                    residentId: resident.id,
                    residentName: `${resident.first_name} ${resident.last_name}`,
                    score: 100,
                    reasons: ['reviewed-mapping'],
                    apartmentTypeId: apartmentTypeIdForLabel(
                        row.apartmentTypeLabel,
                    ),
                });
                continue;
            }

            const ranked = residents
                .map((resident) => ({
                    resident,
                    ...scoreResident(row, resident),
                }))
                .filter((candidate) => candidate.score >= 50)
                .sort((a, b) => b.score - a.score);

            if (!ranked.length) {
                unmatched.push({ row, reason: 'no candidate scored >= 50' });
                continue;
            }

            const [best, second] = ranked;
            if (second && best.score - second.score < 10) {
                ambiguous.push({
                    row,
                    candidates: ranked.slice(0, 5).map((candidate) => ({
                        residentId: candidate.resident.id,
                        name: `${candidate.resident.first_name} ${candidate.resident.last_name}`,
                        houseNo: candidate.resident.house_no,
                        street: candidate.resident.street?.name,
                        score: candidate.score,
                        reasons: candidate.reasons,
                    })),
                });
                continue;
            }

            matched.push({
                row,
                residentId: best.resident.id,
                residentName: `${best.resident.first_name} ${best.resident.last_name}`,
                score: best.score,
                reasons: best.reasons,
                apartmentTypeId: apartmentTypeIdForLabel(
                    row.apartmentTypeLabel,
                ),
            });
        }

        const byResident = new Map<string, any>();
        for (const match of matched) {
            const existing = byResident.get(match.residentId);
            if (existing) {
                existing.amount += match.row.amount;
                existing.rows.push(match.row);
                existing.sourceRows.push(match.row.sourceRow);
            } else {
                byResident.set(match.residentId, {
                    residentId: match.residentId,
                    residentName: match.residentName,
                    amount: match.row.amount,
                    apartmentTypeId: match.apartmentTypeId,
                    rows: [match.row],
                    sourceRows: [match.row.sourceRow],
                });
            }
        }

        const summary = {
            mode: args.commit ? 'commit' : 'dry-run',
            estateId,
            sourceRows: rows.length,
            reviewedMappings: reviewedMappings.size,
            matchedRows: matched.length,
            uniqueMatchedResidents: byResident.size,
            unmatchedRows: unmatched.length,
            ambiguousRows: ambiguous.length,
            matchedAmount: Number(
                matched
                    .reduce((sum, match) => sum + match.row.amount, 0)
                    .toFixed(2),
            ),
            uniqueResidentAmount: Number(
                Array.from(byResident.values())
                    .reduce((sum, match) => sum + match.amount, 0)
                    .toFixed(2),
            ),
        };

        const report = {
            summary,
            matched,
            aggregatedAssignments: Array.from(byResident.values()),
            unmatched,
            ambiguous,
        };

        const reportPath = join(
            'tmp',
            'paid-residents-2026-import-report.json',
        );
        ensureOutputDir(reportPath);
        writeFileSync(reportPath, JSON.stringify(report, null, 2));

        console.log(JSON.stringify(summary, null, 2));
        console.log(`Report written to ${reportPath}`);

        if (!args.commit) {
            console.log('Dry-run only. Re-run with --commit to write changes.');
            return;
        }

        if ((unmatched.length || ambiguous.length) && !args.allowPartial) {
            throw new Error(
                'Import blocked: unmatched or ambiguous rows exist. Review the report or re-run with --allow-partial.',
            );
        }

        const actor = await prisma.user.findFirst({
            where: {
                estateId,
                role: { in: [Role.SUPER_ADMIN, Role.ADMIN] },
            },
            orderBy: { createdAt: 'asc' },
            select: { id: true },
        });

        if (!actor) {
            throw new Error('No admin/super admin user found to own the levy.');
        }

        await prisma.$transaction(
            async (tx) => {
                const levy = await tx.levy.upsert({
                    where: {
                        estateId_category_period: {
                            estateId,
                            category: LevyCategory.ADMIN_LEVY,
                            period: LEVY_PERIOD,
                        },
                    },
                    update: {
                        title: LEVY_TITLE,
                        description: LEVY_DESCRIPTION,
                        amount: new Prisma.Decimal(50000),
                        dueDate: new Date(args.dueDate),
                    },
                    create: {
                        estateId,
                        createdById: actor.id,
                        title: LEVY_TITLE,
                        description: LEVY_DESCRIPTION,
                        category: LevyCategory.ADMIN_LEVY,
                        period: LEVY_PERIOD,
                        amount: new Prisma.Decimal(50000),
                        dueDate: new Date(args.dueDate),
                    },
                });

                await tx.levyApartmentTypePrice.deleteMany({
                    where: { levyId: levy.id },
                });

                await tx.levyApartmentTypePrice.createMany({
                    data: APARTMENT_TYPE_PRICES.map((price) => ({
                        levyId: levy.id,
                        apartmentTypeId: price.apartmentTypeId,
                        amount: new Prisma.Decimal(price.amount),
                    })),
                });

                for (const assignment of byResident.values()) {
                    await tx.levyAssignment.upsert({
                        where: {
                            levyId_residentId: {
                                levyId: levy.id,
                                residentId: assignment.residentId,
                            },
                        },
                        update: {
                            amount: new Prisma.Decimal(assignment.amount),
                            paidAmount: new Prisma.Decimal(assignment.amount),
                            status: LevyStatus.PAID,
                            paidAt: new Date(args.paidAt),
                        },
                        create: {
                            levyId: levy.id,
                            residentId: assignment.residentId,
                            amount: new Prisma.Decimal(assignment.amount),
                            paidAmount: new Prisma.Decimal(assignment.amount),
                            status: LevyStatus.PAID,
                            paidAt: new Date(args.paidAt),
                        },
                    });

                    if (
                        args.updateApartmentTypes &&
                        assignment.apartmentTypeId
                    ) {
                        await tx.resident.update({
                            where: { id: assignment.residentId },
                            data: {
                                apartmentTypeId: assignment.apartmentTypeId,
                            },
                        });
                    }

                    const outstandingCount = await tx.levyAssignment.count({
                        where: {
                            residentId: assignment.residentId,
                            status: { not: LevyStatus.PAID },
                            levy: { dueDate: { lte: new Date() } },
                        },
                    });

                    await tx.resident.update({
                        where: { id: assignment.residentId },
                        data: { levyCleared: outstandingCount === 0 },
                    });
                }
            },
            { timeout: 60_000 },
        );

        console.log(
            'Import committed successfully. Estate wallet was not credited.',
        );
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});

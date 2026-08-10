import { HttpStatus, Injectable } from '@nestjs/common';
import {
    LevyStatus,
    KycStatus,
    Prisma,
    ResidentAssociateCategory,
    ResidentStatus,
    Role,
    WalletTransactionStatus,
    WalletTransactionType,
    WithdrawalStatus,
} from '@prisma/client';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../database/prisma/prisma.service';
import { error, success } from '../../common/utils/response.util';
import {
    CreateLevyDto,
    FundWalletDto,
    RejectWithdrawalDto,
    RequestWithdrawalDto,
} from './dto/finance.dto';
import { PaystackService } from './paystack.service';
import { CreateFinanceRecordDto, FinanceRecordType } from './dto/finance-record.dto';

@Injectable()
export class FinanceService {
    private readonly withdrawalFeeRate = 0.015;
    private readonly monthlyResidentLevyAmount = 500;
    private readonly monthlyResidentLevyCategory = 'MONTHLY_RESIDENT_LEVY';

    constructor(
        private readonly prisma: PrismaService,
        private readonly paystack: PaystackService,
    ) { }

    private reference(prefix: string) {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    }

    private toNumber(
        value: Prisma.Decimal | number | string | null | undefined,
    ) {
        return value === null || value === undefined ? 0 : Number(value);
    }

    private currentMonthlyPeriod(date = new Date()) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }

    private monthlyLevyDueDate(period: string) {
        const [year, month] = period.split('-').map(Number);
        return new Date(year, month, 0, 23, 59, 59, 999);
    }

    private async getMonthlyLevyActorId(
        estateId: string,
        fallbackUserId?: string | null,
    ) {
        const actor = await this.prisma.user.findFirst({
            where: {
                estateId,
                role: { in: [Role.SUPER_ADMIN, Role.ADMIN] },
            },
            orderBy: { createdAt: 'asc' },
            select: { id: true },
        });

        return actor?.id ?? fallbackUserId;
    }

    private async getOrCreateMonthlyLevy(input: {
        estateId: string;
        period: string;
        actorId: string;
    }) {
        const dueDate = this.monthlyLevyDueDate(input.period);

        return this.prisma.levy.upsert({
            where: {
                estateId_category_period: {
                    estateId: input.estateId,
                    category: this.monthlyResidentLevyCategory,
                    period: input.period,
                },
            },
            update: {},
            create: {
                estateId: input.estateId,
                createdById: input.actorId,
                category: this.monthlyResidentLevyCategory,
                period: input.period,
                title: `Monthly Resident Levy - ${input.period}`,
                description:
                    'Monthly resident levy charged per registered head',
                amount: this.monthlyResidentLevyAmount,
                dueDate,
            },
        });
    }

    async ensureMonthlyResidentLevyForResident(
        residentId: string,
        period = this.currentMonthlyPeriod(),
    ) {
        const resident = await this.prisma.resident.findUnique({
            where: { id: residentId },
            select: { id: true, estateId: true, userId: true },
        });

        if (!resident) {
            error('Not Found', 'Resident not found', HttpStatus.NOT_FOUND);
            throw new Error('RESIDENT_NOT_FOUND');
        }

        const actorId = await this.getMonthlyLevyActorId(
            resident.estateId,
            resident.userId,
        );

        if (!actorId) {
            error(
                'Monthly Levy Error',
                'No user found to create monthly resident levy',
                HttpStatus.BAD_REQUEST,
            );
            throw new Error('LEVY_ACTOR_NOT_FOUND');
        }

        const coResidentCount = await this.prisma.residentAssociate.count({
            where: {
                residentId: resident.id,
                category: ResidentAssociateCategory.CO_RESIDENT,
            },
        });
        const headCount = 1 + coResidentCount;
        const amount = this.monthlyResidentLevyAmount * headCount;
        const levy = await this.getOrCreateMonthlyLevy({
            estateId: resident.estateId,
            period,
            actorId,
        });

        const assignment = await this.prisma.levyAssignment.upsert({
            where: {
                levyId_residentId: {
                    levyId: levy.id,
                    residentId: resident.id,
                },
            },
            update: {
                amount,
                headCount,
            },
            create: {
                levyId: levy.id,
                residentId: resident.id,
                amount,
                headCount,
            },
            include: { levy: true },
        });

        const paidAmount = this.toNumber(assignment.paidAmount);
        const status =
            paidAmount >= amount
                ? LevyStatus.PAID
                : paidAmount > 0
                    ? LevyStatus.PARTIALLY_PAID
                    : LevyStatus.PENDING;

        const updatedAssignment = await this.prisma.levyAssignment.update({
            where: { id: assignment.id },
            data: {
                status,
                paidAt:
                    status === LevyStatus.PAID
                        ? (assignment.paidAt ?? new Date())
                        : null,
            },
            include: { levy: true },
        });

        await this.updateResidentLevyCleared(this.prisma, resident.id);
        await this.tryPayOutstandingMonthlyLevies(resident.id);

        return (await this.prisma.levyAssignment.findUnique({
            where: { id: updatedAssignment.id },
            include: { levy: true },
        }))!;
    }

    async generateMonthlyResidentLevies(period = this.currentMonthlyPeriod()) {
        const residents = await this.prisma.resident.findMany({
            where: {
                kycStatus: KycStatus.COMPLETED,
                status: ResidentStatus.ACTIVE,
            },
            select: { id: true },
        });

        const assignments: any[] = [];

        for (const resident of residents) {
            assignments.push(
                await this.ensureMonthlyResidentLevyForResident(
                    resident.id,
                    period,
                ),
            );
        }

        return success(
            {
                period,
                residentCount: residents.length,
                assignmentCount: assignments.length,
                assignments,
            },
            'Monthly Levies Generated',
            'Monthly resident levies generated successfully',
        );
    }

    @Cron('0 0 1 * *')
    async generateMonthlyResidentLeviesCron() {
        await this.generateMonthlyResidentLevies();
    }

    private async tryPayOutstandingMonthlyLevies(residentId: string) {
        const resident = await this.prisma.resident.findUnique({
            where: { id: residentId },
            include: { wallet: true },
        });

        if (!resident?.wallet) {
            return [];
        }

        const paidAssignments: any[] = [];

        while (true) {
            const assignment = await this.prisma.levyAssignment.findFirst({
                where: {
                    residentId,
                    status: {
                        in: [
                            LevyStatus.PENDING,
                            LevyStatus.PARTIALLY_PAID,
                            LevyStatus.OVERDUE,
                        ],
                    },
                    levy: { category: this.monthlyResidentLevyCategory },
                },
                include: { levy: true },
                orderBy: { levy: { dueDate: 'asc' } },
            });

            if (!assignment) {
                break;
            }

            const outstandingAmount =
                this.toNumber(assignment.amount) -
                this.toNumber(assignment.paidAmount);

            if (outstandingAmount <= 0) {
                await this.prisma.levyAssignment.update({
                    where: { id: assignment.id },
                    data: {
                        status: LevyStatus.PAID,
                        paidAt: assignment.paidAt ?? new Date(),
                    },
                });
                continue;
            }

            const wallet = await this.prisma.wallet.findUnique({
                where: { id: resident.wallet.id },
            });

            if (!wallet || this.toNumber(wallet.balance) < outstandingAmount) {
                break;
            }

            const paid = await this.prisma.$transaction(async (tx) => {
                await tx.wallet.update({
                    where: { id: wallet.id },
                    data: { balance: { decrement: outstandingAmount } },
                });

                const transaction = await tx.walletTransaction.create({
                    data: {
                        walletId: wallet.id,
                        type: WalletTransactionType.LEVY_PAYMENT,
                        status: WalletTransactionStatus.SUCCESS,
                        amount: outstandingAmount,
                        levyAssignmentId: assignment.id,
                        reference: this.reference('monthly_levy'),
                        description: `Monthly resident levy payment: ${assignment.levy.period ?? assignment.levy.title}`,
                    },
                });

                const updatedAssignment = await tx.levyAssignment.update({
                    where: { id: assignment.id },
                    data: {
                        paidAmount: this.toNumber(assignment.amount),
                        status: LevyStatus.PAID,
                        paidAt: new Date(),
                    },
                });

                await this.updateResidentLevyCleared(tx, residentId);

                return { transaction, assignment: updatedAssignment };
            });

            paidAssignments.push(paid);
        }

        await this.updateResidentLevyCleared(this.prisma, residentId);

        return paidAssignments;
    }

    private async getUser(userId: string): Promise<
        Prisma.UserGetPayload<{
            include: { resident: { include: { wallet: true } } };
        }>
    > {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { resident: { include: { wallet: true } } },
        });

        if (!user) {
            error('Not Found', 'User not found', HttpStatus.NOT_FOUND);
            throw new Error('USER_NOT_FOUND');
        }

        return user;
    }

    private async getResidentWallet(userId: string) {
        const user = await this.getUser(userId);

        if (!user.resident) {
            error(
                'Resident Not Found',
                'Only residents can use wallet operations',
                HttpStatus.FORBIDDEN,
            );
            throw new Error('RESIDENT_NOT_FOUND');
        }

        const wallet =
            user.resident.wallet ??
            (await this.prisma.wallet.create({
                data: { residentId: user.resident.id },
            }));

        return { user, resident: user.resident, wallet };
    }

    async getBanks() {
        const banks = await this.paystack.getBanks();

        return success(banks.data, 'Banks', 'Banks fetched successfully');
    }

    async resolveAccountNumber(accountNumber: string, bankCode: string) {
        try {
            const account = await this.paystack.resolveAccountNumber(
                accountNumber,
                bankCode,
            );

            return success(
                account.data,
                'Account Verified',
                'Account verified successfully',
            );
        } catch (err: any) {
            console.log('errr:', err);
            return error('Failed to resolve account number', err.message);
        }
    }

    async createLevy(userId: string, dto: CreateLevyDto) {
        const user = await this.getUser(userId);

        const residents = await this.prisma.resident.findMany({
            where: {
                estateId: user.estateId,
                ...(dto.residentIds?.length
                    ? { id: { in: dto.residentIds } }
                    : {}),
            },
            select: { id: true },
        });

        if (residents.length === 0) {
            error(
                'No Residents',
                'No residents found for this levy',
                HttpStatus.BAD_REQUEST,
            );
            throw new Error('NO_RESIDENTS');
        }

        const levy = await this.prisma.levy.create({
            data: {
                estateId: user.estateId,
                createdById: user.id,
                title: dto.title,
                description: dto.description,
                amount: dto.amount,
                dueDate: new Date(dto.dueDate),
                assignments: {
                    create: residents.map((resident) => ({
                        residentId: resident.id,
                        amount: dto.amount,
                    })),
                },
            },
            include: {
                assignments: true,
            },
        });

        return success(levy, 'Levy Created', 'Levy assigned successfully');
    }

    async getLevies(userId: string) {
        const user = await this.getUser(userId);

        const levies = await this.prisma.levy.findMany({
            where: { estateId: user.estateId },
            include: {
                assignments: {
                    include: {
                        resident: {
                            select: {
                                id: true,
                                first_name: true,
                                last_name: true,
                                house_no: true,
                                block: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return success(levies, 'Levies', 'Levies fetched successfully');
    }

    async getOutstandingBills(userId: string) {
        const { resident } = await this.getResidentWallet(userId);

        const assignments = await this.prisma.levyAssignment.findMany({
            where: {
                residentId: resident.id,
                status: {
                    in: [
                        LevyStatus.PENDING,
                        LevyStatus.PARTIALLY_PAID,
                        LevyStatus.OVERDUE,
                    ],
                },
            },
            include: { levy: true },
            orderBy: { levy: { dueDate: 'asc' } },
        });

        return success(
            assignments.map((assignment) => ({
                ...assignment,
                outstandingAmount:
                    this.toNumber(assignment.amount) -
                    this.toNumber(assignment.paidAmount),
                status:
                    assignment.status !== LevyStatus.PAID &&
                        assignment.levy.dueDate < new Date()
                        ? LevyStatus.OVERDUE
                        : assignment.status,
            })),
            'Outstanding Bills',
            'Outstanding bills fetched successfully',
        );
    }

    async getWallet(userId: string) {
        const { wallet } = await this.getResidentWallet(userId);

        const transactions = await this.prisma.walletTransaction.findMany({
            where: { walletId: wallet.id },
            include: {
                levyAssignment: {
                    include: { levy: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });

        return success(
            {
                wallet,
                virtualAccount: {
                    bankName: wallet.virtualBankName,
                    accountNumber: wallet.virtualAccountNumber,
                    accountName: wallet.virtualAccountName,
                },
                transactions,
            },
            'Wallet',
            'Wallet fetched successfully',
        );
    }

    async initializeWalletFunding(userId: string, dto: FundWalletDto) {
        console.log('Funding intialized');
        const { user, resident, wallet } = await this.getResidentWallet(userId);
        const reference = this.reference('wallet');
        console.log('Funding intialized');
        await this.prisma.walletTransaction.create({
            data: {
                walletId: wallet.id,
                type: WalletTransactionType.FUNDING,
                status: WalletTransactionStatus.PENDING,
                amount: dto.amount,
                reference,
                description: 'Wallet funding via Paystack',
            },
        });

        console.log('[WalletTraction]:', 'creating wallet transaction');

        const payment = await this.paystack.initializeTransaction(
            resident.email || user.email,
            dto.amount,
            reference,
            {
                purpose: 'wallet_funding',
                walletId: wallet.id,
                residentId: resident.id,
            },
        );
        console.log('[Payment Transaction]:', payment);
        console.log('[PaymentData]:', payment.data);

        return success(
            payment.data,
            'Payment Initialized',
            'Wallet funding initialized successfully',
        );
    }

    async initializeLevyPayment(userId: string, assignmentId: string) {
        const { user, resident, wallet } = await this.getResidentWallet(userId);

        const assignment = await this.prisma.levyAssignment.findFirst({
            where: {
                id: assignmentId,
                residentId: resident.id,
            },
            include: { levy: true },
        });

        if (!assignment) {
            error('Not Found', 'Levy bill not found', HttpStatus.NOT_FOUND);
            throw new Error('LEVY_NOT_FOUND');
        }

        const outstandingAmount =
            this.toNumber(assignment.amount) -
            this.toNumber(assignment.paidAmount);

        if (outstandingAmount <= 0 || assignment.status === LevyStatus.PAID) {
            error(
                'Already Paid',
                'This levy has already been paid',
                HttpStatus.BAD_REQUEST,
            );
            throw new Error('LEVY_PAID');
        }

        const reference = this.reference('levy');

        await this.prisma.walletTransaction.create({
            data: {
                walletId: wallet.id,
                type: WalletTransactionType.LEVY_PAYMENT,
                status: WalletTransactionStatus.PENDING,
                amount: outstandingAmount,
                levyAssignmentId: assignment.id,
                reference,
                description: `Paystack levy payment: ${assignment.levy.title}`,
            },
        });

        const payment = await this.paystack.initializeTransaction(
            resident.email || user.email,
            outstandingAmount,
            reference,
            {
                purpose: 'levy_payment',
                walletId: wallet.id,
                residentId: resident.id,
                levyAssignmentId: assignment.id,
            },
        );

        return success(
            payment.data,
            'Payment Initialized',
            'Levy payment initialized successfully',
        );
    }

    async payLevyFromWallet(userId: string, assignmentId: string) {
        const { resident, wallet } = await this.getResidentWallet(userId);

        const result = await this.prisma
            .$transaction(async (tx) => {
                const assignment = await tx.levyAssignment.findFirst({
                    where: {
                        id: assignmentId,
                        residentId: resident.id,
                    },
                    include: { levy: true },
                });

                if (!assignment) {
                    throw new Error('LEVY_NOT_FOUND');
                }

                const outstandingAmount =
                    this.toNumber(assignment.amount) -
                    this.toNumber(assignment.paidAmount);

                if (
                    outstandingAmount <= 0 ||
                    assignment.status === LevyStatus.PAID
                ) {
                    throw new Error('LEVY_PAID');
                }

                const latestWallet = await tx.wallet.findUnique({
                    where: { id: wallet.id },
                });

                if (
                    !latestWallet ||
                    this.toNumber(latestWallet.balance) < outstandingAmount
                ) {
                    throw new Error('INSUFFICIENT_BALANCE');
                }

                await tx.wallet.update({
                    where: { id: wallet.id },
                    data: { balance: { decrement: outstandingAmount } },
                });

                const transaction = await tx.walletTransaction.create({
                    data: {
                        walletId: wallet.id,
                        type: WalletTransactionType.LEVY_PAYMENT,
                        status: WalletTransactionStatus.SUCCESS,
                        amount: outstandingAmount,
                        levyAssignmentId: assignment.id,
                        reference: this.reference('wallet_levy'),
                        description: `Wallet levy payment: ${assignment.levy.title}`,
                    },
                });

                const paidAmount =
                    this.toNumber(assignment.paidAmount) + outstandingAmount;

                const updatedAssignment = await tx.levyAssignment.update({
                    where: { id: assignment.id },
                    data: {
                        paidAmount,
                        paidAt: new Date(),
                        status: LevyStatus.PAID,
                    },
                });

                await this.updateResidentLevyCleared(tx, resident.id);

                return { transaction, assignment: updatedAssignment };
            })
            .catch((err) => {
                if (err.message === 'LEVY_NOT_FOUND') {
                    error(
                        'Not Found',
                        'Levy bill not found',
                        HttpStatus.NOT_FOUND,
                    );
                }

                if (err.message === 'LEVY_PAID') {
                    error(
                        'Already Paid',
                        'This levy has already been paid',
                        HttpStatus.BAD_REQUEST,
                    );
                }

                if (err.message === 'INSUFFICIENT_BALANCE') {
                    error(
                        'Insufficient Balance',
                        'Wallet balance is too low for this payment',
                        HttpStatus.BAD_REQUEST,
                    );
                }

                throw err;
            });

        return success(
            result,
            'Levy Paid',
            'Levy paid from wallet successfully',
        );
    }

    async payOutstandingMonthlyLeviesFromWallet(userId: string) {
        const { resident } = await this.getResidentWallet(userId);
        const paid = await this.tryPayOutstandingMonthlyLevies(resident.id);

        const outstanding = await this.prisma.levyAssignment.findMany({
            where: {
                residentId: resident.id,
                status: {
                    in: [
                        LevyStatus.PENDING,
                        LevyStatus.PARTIALLY_PAID,
                        LevyStatus.OVERDUE,
                    ],
                },
                levy: { category: this.monthlyResidentLevyCategory },
            },
            include: { levy: true },
            orderBy: { levy: { dueDate: 'asc' } },
        });

        return success(
            {
                paid,
                outstanding,
                levyCleared: outstanding.length === 0,
            },
            outstanding.length ? 'Levy Outstanding' : 'Levy Paid',
            outstanding.length
                ? 'Wallet balance is not enough to clear all outstanding monthly levies'
                : 'Outstanding monthly levies paid successfully',
        );
    }

    async requestWithdrawal(userId: string, dto: RequestWithdrawalDto) {
        const { resident, wallet } = await this.getResidentWallet(userId);
        const fee = Number((dto.amount * this.withdrawalFeeRate).toFixed(2));
        const netAmount = Number((dto.amount - fee).toFixed(2));

        const result = await this.prisma
            .$transaction(async (tx) => {
                const latestWallet = await tx.wallet.findUnique({
                    where: { id: wallet.id },
                });

                if (
                    !latestWallet ||
                    this.toNumber(latestWallet.balance) < dto.amount
                ) {
                    throw new Error('INSUFFICIENT_BALANCE');
                }

                await tx.wallet.update({
                    where: { id: wallet.id },
                    data: { balance: { decrement: dto.amount } },
                });

                const withdrawal = await tx.withdrawalRequest.create({
                    data: {
                        residentId: resident.id,
                        amount: dto.amount,
                        bankName: dto.bankName,
                        accountName: dto.accountName,
                        accountNumber: dto.accountNumber,
                    },
                });

                const transaction = await tx.walletTransaction.create({
                    data: {
                        walletId: wallet.id,
                        type: WalletTransactionType.WITHDRAWAL,
                        status: WalletTransactionStatus.PENDING,
                        amount: dto.amount,
                        reference: `withdrawal:${withdrawal.id}`,
                        description: `Withdrawal request. Fee: NGN ${fee}. Net payout: NGN ${netAmount}. Bank code: ${dto.bankCode ?? 'not provided'}`,
                    },
                });

                return { withdrawal, transaction, fee, netAmount };
            })
            .catch((err) => {
                console.error('Withdrawal Request Error:', err);

                switch (err.message) {
                    case 'INSUFFICIENT_BALANCE':
                        return error(
                            'Insufficient Balance',
                            `Wallet balance is too low for this withdrawal`,
                            HttpStatus.BAD_REQUEST,
                        );

                    default:
                        return error(
                            'Withdrawal Request Failed',
                            'Unable to process withdrawal request at this time',
                            HttpStatus.INTERNAL_SERVER_ERROR,
                        );
                }
            });

        return success(
            result,
            'Withdrawal Requested',
            'Withdrawal request submitted for admin approval',
        );
    }

    async getWithdrawalRequests(userId: string) {
        const user = await this.getUser(userId);
        const adminRoles: Role[] = [Role.ADMIN, Role.SUPER_ADMIN];
        const isAdmin = adminRoles.includes(user.role);

        const withdrawals = await this.prisma.withdrawalRequest.findMany({
            where: isAdmin
                ? { resident: { estateId: user.estateId } }
                : { residentId: user.resident?.id ?? '' },
            include: {
                resident: {
                    select: {
                        id: true,
                        first_name: true,
                        last_name: true,
                        house_no: true,
                        block: true,
                    },
                },
                approvedBy: {
                    select: { id: true, email: true, role: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return success(
            withdrawals,
            'Withdrawals',
            'Withdrawal requests fetched successfully',
        );
    }

    async approveWithdrawal(
        userId: string,
        withdrawalId: string,
        bankCode?: string,
    ) {
        const admin = await this.getUser(userId);

        const withdrawal = await this.prisma.withdrawalRequest.findUnique({
            where: { id: withdrawalId },
            include: {
                resident: { include: { wallet: true } },
            },
        });

        if (!withdrawal) {
            return error(
                'Not Found',
                'Withdrawal request not found',
                HttpStatus.NOT_FOUND,
            );
        }

        if (withdrawal.resident.estateId !== admin.estateId) {
            return error(
                'Forbidden',
                'Cannot approve withdrawal outside your estate',
                HttpStatus.FORBIDDEN,
            );
        }

        if (withdrawal.status !== WithdrawalStatus.PENDING) {
            return error(
                'Invalid Status',
                'Only pending withdrawals can be approved',
                HttpStatus.BAD_REQUEST,
            );
        }

        const fee = Number(
            (this.toNumber(withdrawal.amount) * this.withdrawalFeeRate).toFixed(
                2,
            ),
        );
        const netAmount = Number(
            (this.toNumber(withdrawal.amount) - fee).toFixed(2),
        );

        try {
            if (bankCode) {
                const recipient = await this.paystack.createTransferRecipient(
                    withdrawal.accountName,
                    withdrawal.accountNumber,
                    bankCode,
                );

                await this.paystack.initiateTransfer(
                    netAmount,
                    recipient.data.recipient_code,
                    this.reference('transfer'),
                    'OderaSafe wallet withdrawal',
                );
            }
        } catch (err: any) {
            return error(
                'Transfer Failed',
                err?.message || 'Cannot resolve account',
                HttpStatus.BAD_REQUEST,
            );
        }

        const updatedWithdrawal = await this.prisma.withdrawalRequest.update({
            where: { id: withdrawal.id },
            data: {
                status: bankCode
                    ? WithdrawalStatus.PAID
                    : WithdrawalStatus.APPROVED,
                approvedById: admin.id,
                approvedAt: new Date(),
                paidAt: bankCode ? new Date() : null,
            },
        });

        if (withdrawal.resident.wallet) {
            await this.prisma.walletTransaction.updateMany({
                where: {
                    walletId: withdrawal.resident.wallet.id,
                    reference: `withdrawal:${withdrawal.id}`,
                },
                data: {
                    status: bankCode
                        ? WalletTransactionStatus.SUCCESS
                        : WalletTransactionStatus.PENDING,
                },
            });
        }

        return success(
            { withdrawal: updatedWithdrawal, fee, netAmount },
            bankCode ? 'Withdrawal Paid' : 'Withdrawal Approved',
            bankCode
                ? 'Withdrawal approved and Paystack transfer initiated'
                : 'Withdrawal approved for manual transfer processing',
        );
    }

    async rejectWithdrawal(
        userId: string,
        withdrawalId: string,
        dto: RejectWithdrawalDto,
    ) {
        const admin = await this.getUser(userId);

        const withdrawal = await this.prisma.withdrawalRequest.findUnique({
            where: { id: withdrawalId },
            include: {
                resident: { include: { wallet: true } },
            },
        });

        if (!withdrawal) {
            return error(
                'Not Found',
                'Withdrawal request not found',
                HttpStatus.NOT_FOUND,
            );
        }

        if (withdrawal.resident.estateId !== admin.estateId) {
            return error(
                'Forbidden',
                'Cannot reject withdrawal outside your estate',
                HttpStatus.FORBIDDEN,
            );
        }

        if (withdrawal.status !== WithdrawalStatus.PENDING) {
            return error(
                'Invalid Status',
                'Only pending withdrawals can be rejected',
                HttpStatus.BAD_REQUEST,
            );
        }

        if (!withdrawal.resident.wallet) {
            return error(
                'Wallet Not Found',
                'Resident wallet not found',
                HttpStatus.NOT_FOUND,
            );
        }

        const result = await this.prisma.$transaction(async (tx) => {
            await tx.wallet.update({
                where: { id: withdrawal.resident.wallet!.id },
                data: { balance: { increment: withdrawal.amount } },
            });

            await tx.walletTransaction.updateMany({
                where: {
                    walletId: withdrawal.resident.wallet!.id,
                    reference: `withdrawal:${withdrawal.id}`,
                },
                data: { status: WalletTransactionStatus.FAILED },
            });

            await tx.walletTransaction.create({
                data: {
                    walletId: withdrawal.resident.wallet!.id,
                    type: WalletTransactionType.REFUND,
                    status: WalletTransactionStatus.SUCCESS,
                    amount: withdrawal.amount,
                    reference: this.reference('withdrawal_refund'),
                    description: `Withdrawal rejected: ${dto.rejectionReason}`,
                },
            });

            return tx.withdrawalRequest.update({
                where: { id: withdrawal.id },
                data: {
                    status: WithdrawalStatus.REJECTED,
                    approvedById: admin.id,
                    approvedAt: new Date(),
                    rejectionReason: dto.rejectionReason,
                },
            });
        });

        return success(
            result,
            'Withdrawal Rejected',
            'Withdrawal rejected and wallet refunded',
        );
    }

    async handlePaystackWebhook(
        rawBody: Buffer | string,
        signature: string | undefined,
        body: any,
    ) {
        const payload = rawBody || JSON.stringify(body);
        console.log('Calling paystack webhook');

        if (!this.paystack.verifyWebhookSignature(payload, signature)) {
            return error(
                'Invalid Signature',
                'Paystack webhook signature is invalid',
                HttpStatus.UNAUTHORIZED,
            );
        }

        if (body.event === 'dedicatedaccount.assign.success') {
            return success(
                body.data,
                'Virtual Account Assigned',
                'Dedicated account assignment acknowledged',
            );
        }

        if (body.event === 'dedicatedaccount.assign.failed') {
            return success(
                body.data,
                'Virtual Account Assignment Failed',
                'Dedicated account assignment failure acknowledged',
            );
        }

        if (body.event !== 'charge.success') {
            return success(null, 'Webhook Ignored', 'Paystack event ignored');
        }

        const reference = body.data?.reference;

        if (!reference) {
            return error(
                'Invalid Webhook',
                'Paystack reference is missing',
                HttpStatus.BAD_REQUEST,
            );
        }

        const verified = await this.paystack.verifyTransaction(reference);

        if (verified.data.status !== 'success') {
            return error(
                'Payment Failed',
                'Paystack payment is not successful',
                HttpStatus.BAD_REQUEST,
            );
        }

        const transaction = await this.prisma.walletTransaction.findUnique({
            where: { reference },
            include: {
                wallet: { include: { resident: true } },
                levyAssignment: true,
            },
        });

        if (!transaction) {
            return this.creditDedicatedAccountTransfer(
                verified.data,
                body.data,
            );
        }

        if (transaction.status === WalletTransactionStatus.SUCCESS) {
            return success(
                transaction,
                'Already Processed',
                'Payment already processed',
            );
        }

        const result = await this.prisma.$transaction(async (tx) => {
            const paidAmount = verified.data.amount / 100;

            const updatedTransaction = await tx.walletTransaction.update({
                where: { id: transaction.id },
                data: {
                    status: WalletTransactionStatus.SUCCESS,
                    amount: paidAmount,
                },
            });

            if (transaction.type === WalletTransactionType.FUNDING) {
                await tx.wallet.update({
                    where: { id: transaction.walletId },
                    data: { balance: { increment: paidAmount } },
                });
            }

            if (
                transaction.type === WalletTransactionType.LEVY_PAYMENT &&
                transaction.levyAssignmentId
            ) {
                const assignment = await tx.levyAssignment.findUnique({
                    where: { id: transaction.levyAssignmentId },
                });

                if (assignment) {
                    const nextPaidAmount =
                        this.toNumber(assignment.paidAmount) + paidAmount;
                    const totalAmount = this.toNumber(assignment.amount);

                    await tx.levyAssignment.update({
                        where: { id: assignment.id },
                        data: {
                            paidAmount: nextPaidAmount,
                            status:
                                nextPaidAmount >= totalAmount
                                    ? LevyStatus.PAID
                                    : LevyStatus.PARTIALLY_PAID,
                            paidAt:
                                nextPaidAmount >= totalAmount
                                    ? new Date()
                                    : null,
                        },
                    });

                    await this.updateResidentLevyCleared(
                        tx,
                        assignment.residentId,
                    );
                }
            }
            console.log('Transaction update:', updatedTransaction);

            return updatedTransaction;
        });

        if (transaction.type === WalletTransactionType.FUNDING) {
            await this.tryPayOutstandingMonthlyLevies(
                transaction.wallet.resident.id,
            );
        }

        return success(
            result,
            'Webhook Processed',
            'Payment confirmed successfully',
        );
    }

    private async creditDedicatedAccountTransfer(
        verifiedData: any,
        webhookData: any,
    ) {
        const reference = verifiedData.reference;

        const existingTransaction =
            await this.prisma.walletTransaction.findUnique({
                where: { reference },
            });

        if (existingTransaction) {
            return success(
                existingTransaction,
                'Already Processed',
                'Transfer already processed',
            );
        }

        const accountNumber =
            verifiedData.authorization?.receiver_bank_account_number ??
            verifiedData.metadata?.receiver_account_number ??
            webhookData?.authorization?.receiver_bank_account_number ??
            webhookData?.dedicated_account?.account_number;

        const customerCode =
            verifiedData.customer?.customer_code ??
            webhookData?.customer?.customer_code;

        if (!accountNumber && !customerCode) {
            return error(
                'Invalid Transfer Webhook',
                'Paystack transfer webhook did not include a virtual account number or customer code',
                HttpStatus.BAD_REQUEST,
            );
        }

        const wallet = await this.prisma.wallet.findFirst({
            where: {
                OR: [
                    ...(accountNumber
                        ? [{ virtualAccountNumber: accountNumber }]
                        : []),
                    ...(customerCode
                        ? [{ paystackCustomerCode: customerCode }]
                        : []),
                ],
            },
        });

        if (!wallet) {
            return error(
                'Wallet Not Found',
                'No wallet matched this dedicated account transfer',
                HttpStatus.NOT_FOUND,
            );
        }

        const amount = verifiedData.amount / 100;

        const result = await this.prisma.$transaction(async (tx) => {
            await tx.wallet.update({
                where: { id: wallet.id },
                data: { balance: { increment: amount } },
            });

            return tx.walletTransaction.create({
                data: {
                    walletId: wallet.id,
                    type: WalletTransactionType.FUNDING,
                    status: WalletTransactionStatus.SUCCESS,
                    amount,
                    reference,
                    description: `Wallet funded by bank transfer to virtual account ${accountNumber ?? wallet.virtualAccountNumber}`,
                },
            });
        });

        await this.tryPayOutstandingMonthlyLevies(wallet.residentId);

        return success(
            result,
            'Wallet Credited',
            'Virtual account transfer credited successfully',
        );
    }

    private async updateResidentLevyCleared(
        tx: Prisma.TransactionClient,
        residentId: string,
    ) {
        const outstandingCount = await tx.levyAssignment.count({
            where: {
                residentId,
                status: { not: LevyStatus.PAID },
            },
        });

        await tx.resident.update({
            where: { id: residentId },
            data: { levyCleared: outstandingCount === 0 },
        });
    }

    async createFinanceRecord(
        userId: string,
        dto: CreateFinanceRecordDto,
    ) {
        const admin = await this.getUser(userId);

        const record = await this.prisma.estateFinanceRecord.create({
            data: {
                estateId: admin.estateId,
                recordedById: admin.id,
                type: dto.type,
                amount: dto.amount,
                description: dto.description,
                category: dto.category,
                recordedAt: dto.recordedAt
                    ? new Date(dto.recordedAt)
                    : new Date(),
            },
            include: {
                recordedBy: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });

        return success(
            record,
            'Finance Record Created',
            `${dto.type === 'INCOME' ? 'Income' : 'Expense'} recorded successfully`,
        );
    }

    async getFinanceRecords(
        userId: string,
        type?: FinanceRecordType,
    ) {
        const admin = await this.getUser(userId);

        const records = await this.prisma.estateFinanceRecord.findMany({
            where: {
                estateId: admin.estateId,
                ...(type ? { type } : {}),
            },
            include: {
                recordedBy: {
                    select: {
                        id: true,
                        email: true,
                        role: true,
                    },
                },
            },
            orderBy: {
                recordedAt: 'desc',
            },
        });

        return success(
            records,
            'Finance Records',
            'Finance records fetched successfully',
        );
    }

    async getFinanceSummary(userId: string) {
        const admin = await this.getUser(userId);

        const records = await this.prisma.estateFinanceRecord.findMany({
            where: {
                estateId: admin.estateId,
            },
            select: {
                type: true,
                amount: true,
            },
        });

        const totalIncome = records
            .filter((record) => record.type === FinanceRecordType.INCOME)
            .reduce((sum, record) => sum + Number(record.amount), 0);

        const totalExpenses = records
            .filter((record) => record.type === FinanceRecordType.EXPENSE)
            .reduce((sum, record) => sum + Number(record.amount), 0);

        return success(
            {
                totalIncome,
                totalExpenses,
                balance: totalIncome - totalExpenses,
            },
            'Finance Summary',
            'Finance summary fetched successfully',
        );
    }
}

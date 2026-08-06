import {
    Body,
    Controller,
    Get,
    Headers,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import {
    CreateLevyDto,
    FundWalletDto,
    RejectWithdrawalDto,
    RequestWithdrawalDto,
    ResolveAccountDto,
} from './dto/finance.dto';
import { FinanceService } from './finance.service';

@ApiTags('Finance')
@Controller('finance')
export class FinanceController {
    constructor(private readonly financeService: FinanceService) {}

    @Post('paystack/webhook')
    @ApiOperation({ summary: 'Paystack payment webhook' })
    handlePaystackWebhook(
        @Req() request: any,
        @Headers('x-paystack-signature') signature?: string,
        @Body() body?: any,
    ) {
        return this.financeService.handlePaystackWebhook(
            request.rawBody,
            signature,
            body,
        );
    }

    @Get('banks')
    async getBanks() {
        return this.financeService.getBanks();
    }

    @Post('resolve-account')
    async resolveAccount(@Body() dto: ResolveAccountDto) {
        return this.financeService.resolveAccountNumber(
            dto.accountNumber,
            dto.bankCode,
        );
    }

    @Post('levies')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({ summary: 'Create and assign levy' })
    createLevy(@CurrentUser() user: any, @Body() dto: CreateLevyDto) {
        return this.financeService.createLevy(user.id, dto);
    }

    @Get('levies')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({ summary: 'Get estate levies' })
    getLevies(@CurrentUser() user: any) {
        return this.financeService.getLevies(user.id);
    }

    @Get('payments/outstanding')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.RESIDENT)
    @ApiOperation({ summary: 'Get resident outstanding levy bills' })
    getOutstandingBills(@CurrentUser() user: any) {
        return this.financeService.getOutstandingBills(user.id);
    }

    @Post('monthly-levies/generate')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Generate monthly resident levies for active residents',
    })
    generateMonthlyResidentLevies(@Query('period') period?: string) {
        return this.financeService.generateMonthlyResidentLevies(period);
    }

    @Post('payments/:assignmentId/paystack')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.RESIDENT)
    @ApiOperation({ summary: 'Initialize Paystack levy payment' })
    initializeLevyPayment(
        @CurrentUser() user: any,
        @Param('assignmentId') assignmentId: string,
    ) {
        return this.financeService.initializeLevyPayment(user.id, assignmentId);
    }

    @Post('payments/:assignmentId/wallet')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.RESIDENT)
    @ApiOperation({ summary: 'Pay levy from wallet' })
    payLevyFromWallet(
        @CurrentUser() user: any,
        @Param('assignmentId') assignmentId: string,
    ) {
        return this.financeService.payLevyFromWallet(user.id, assignmentId);
    }

    @Post('monthly-levies/pay-outstanding')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.RESIDENT)
    @ApiOperation({
        summary: 'Pay all outstanding monthly resident levies from wallet',
    })
    payOutstandingMonthlyLeviesFromWallet(@CurrentUser() user: any) {
        return this.financeService.payOutstandingMonthlyLeviesFromWallet(
            user.id,
        );
    }

    @Get('wallet')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.RESIDENT)
    @ApiOperation({ summary: 'Get resident wallet and transactions' })
    getWallet(@CurrentUser() user: any) {
        return this.financeService.getWallet(user.id);
    }

    @Post('wallet/fund')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.RESIDENT)
    @ApiOperation({ summary: 'Initialize Paystack wallet funding' })
    initializeWalletFunding(
        @CurrentUser() user: any,
        @Body() dto: FundWalletDto,
    ) {
        return this.financeService.initializeWalletFunding(user.id, dto);
    }

    @Post('withdrawals')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.RESIDENT)
    @ApiOperation({ summary: 'Request wallet withdrawal' })
    requestWithdrawal(
        @CurrentUser() user: any,
        @Body() dto: RequestWithdrawalDto,
    ) {
        return this.financeService.requestWithdrawal(user.id, dto);
    }

    @Get('withdrawals')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Get withdrawal requests' })
    getWithdrawalRequests(@CurrentUser() user: any) {
        return this.financeService.getWithdrawalRequests(user.id);
    }

    @Patch('withdrawals/:withdrawalId/approve')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({
        summary: 'Approve withdrawal, optionally initiating Paystack transfer',
    })
    approveWithdrawal(
        @CurrentUser() user: any,
        @Param('withdrawalId') withdrawalId: string,
        @Query('bankCode') bankCode?: string,
    ) {
        return this.financeService.approveWithdrawal(
            user.id,
            withdrawalId,
            bankCode,
        );
    }

    @Patch('withdrawals/:withdrawalId/reject')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @ApiOperation({ summary: 'Reject withdrawal and refund reserved balance' })
    rejectWithdrawal(
        @CurrentUser() user: any,
        @Param('withdrawalId') withdrawalId: string,
        @Body() dto: RejectWithdrawalDto,
    ) {
        return this.financeService.rejectWithdrawal(user.id, withdrawalId, dto);
    }
}

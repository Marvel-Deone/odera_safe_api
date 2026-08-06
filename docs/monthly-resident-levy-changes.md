# Monthly Resident Levy Changes

This document explains the resident levy and wallet restriction changes in simple terms.

## What Changed

The backend now supports monthly resident levy billing based on the number of registered heads attached to a main resident.

Each registered head costs:

```text
NGN 500 per month
```

Registered heads means:

- Main resident
- All registered co-residents under that main resident

Examples:

- Main resident only: `NGN 500/month`
- Main resident + 1 co-resident: `NGN 1,000/month`
- Main resident + 2 co-residents: `NGN 1,500/month`

The main resident pays the total bill from their own wallet.

## Database Changes

### `Levy`

Added metadata for system-generated monthly resident levies:

- `category`
- `period`

Monthly resident levies use:

```text
category = MONTHLY_RESIDENT_LEVY
period = YYYY-MM
```

Example:

```text
MONTHLY_RESIDENT_LEVY / 2026-08
```

There is a unique rule so only one monthly resident levy can exist per estate per month.

### `LevyAssignment`

Added:

- `headCount`

This stores how many registered heads were charged for that resident in that month.

Example:

```json
{
  "headCount": 3,
  "amount": 1500
}
```

## When Monthly Levy Is Created

Monthly levy assignment is created or recalculated when:

- A resident is approved after completing KYC/verification.
- A co-resident is created.
- A co-resident is updated in a way that affects category/headcount.
- A co-resident is deleted.
- Admin manually triggers monthly levy generation.
- The monthly scheduled job runs.

## Wallet and Paystack Flow

The existing resident approval flow already creates:

- Paystack customer profile.
- Dedicated virtual account.
- Resident wallet.

After that approval succeeds, the backend now also creates the resident's current monthly levy assignment.

If the wallet has enough balance, the backend attempts to pay outstanding monthly levies automatically.

If the wallet does not have enough balance, the levy remains outstanding.

## Auto Payment Behavior

The backend attempts to clear outstanding monthly levies when:

- A resident is approved.
- Monthly levy is generated.
- A co-resident changes the headcount.
- Paystack confirms wallet funding.
- Dedicated virtual account transfer credits the wallet.
- Resident calls the pay-outstanding endpoint.

If the wallet balance is enough:

- Wallet balance is deducted.
- `WalletTransaction` is created as `LEVY_PAYMENT`.
- `LevyAssignment` becomes `PAID`.
- Resident `levyCleared` becomes `true` if no unpaid levies remain.

If the wallet balance is not enough:

- No deduction is made.
- Levy remains `PENDING`, `PARTIALLY_PAID`, or `OVERDUE`.
- Resident `levyCleared` remains `false`.

## Defaulting and Restrictions

Residents with unpaid levies are treated as defaulting residents.

The `RolesGuard` now checks `Resident.levyCleared`.

If `levyCleared` is `false`, the resident is blocked from normal app features.

Allowed routes while defaulting:

- `GET /finance/wallet`
- `POST /finance/wallet/fund`
- `GET /finance/payments/outstanding`
- `POST /finance/payments/:assignmentId/wallet`
- `POST /finance/payments/:assignmentId/paystack`
- `POST /finance/monthly-levies/pay-outstanding`

Everything else protected by `JwtAuthGuard + RolesGuard` is restricted for defaulting residents.

## New Endpoints

### Generate Monthly Resident Levies

```http
POST /finance/monthly-levies/generate
```

Roles:

- `ADMIN`
- `SUPER_ADMIN`

Optional query:

```http
?period=2026-08
```

If `period` is not supplied, the backend uses the current month.

Purpose:

- Creates/recalculates monthly levy assignments for all active, KYC-completed residents.
- Calculates bill using `NGN 500 × headCount`.
- Attempts wallet payment where possible.

### Pay All Outstanding Monthly Levies From Wallet

```http
POST /finance/monthly-levies/pay-outstanding
```

Role:

- `RESIDENT`

Purpose:

- Attempts to pay all outstanding monthly resident levies using the main resident wallet.
- Pays oldest outstanding monthly levy first.
- Stops if wallet balance is not enough.

Response includes:

- `paid`
- `outstanding`
- `levyCleared`

## Existing Endpoints Still Used

### View Wallet

```http
GET /finance/wallet
```

Allowed even when resident is defaulting.

### Fund Wallet

```http
POST /finance/wallet/fund
```

Allowed even when resident is defaulting.

After Paystack confirms payment, backend tries to clear outstanding monthly levies automatically.

### View Outstanding Bills

```http
GET /finance/payments/outstanding
```

Allowed even when resident is defaulting.

### Pay Specific Levy From Wallet

```http
POST /finance/payments/:assignmentId/wallet
```

Allowed even when resident is defaulting.

### Pay Specific Levy Via Paystack

```http
POST /finance/payments/:assignmentId/paystack
```

Allowed even when resident is defaulting.

## Files Changed

- `prisma/schema.prisma`
- `prisma/migrations/20260805100000_add_monthly_resident_levy_metadata/migration.sql`
- `src/apis/finance/finance.service.ts`
- `src/apis/finance/finance.controller.ts`
- `src/apis/finance/finance.module.ts`
- `src/apis/auth/guards/roles.guard.ts`
- `src/apis/resident/resident.service.ts`
- `src/apis/resident/resident.module.ts`
- `src/apis/resident-associate/resident-associate.service.ts`
- `src/apis/resident-associate/resident-associate.module.ts`

## Important Implementation Notes

- The levy amount is currently hardcoded as `NGN 500` in `FinanceService`.
- The system category is `MONTHLY_RESIDENT_LEVY`.
- Monthly period format is `YYYY-MM`.
- Monthly levy due date is the last day of the month.
- The monthly cron runs at midnight on the first day of every month.
- Co-residents do not pay directly; they increase the main resident's monthly bill.
- Withdrawals are not allowed for residents in default because withdrawal routes are not in the defaulting allowlist.

## Verification Status

Prisma client generation completed successfully after the schema changes.

The TypeScript files were formatted. Formatting `prisma/schema.prisma` with Prettier failed because this project does not have a Prisma Prettier parser configured, so the schema was left as standard Prisma syntax.

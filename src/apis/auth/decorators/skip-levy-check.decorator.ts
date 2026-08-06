import { SetMetadata } from '@nestjs/common';

export const SKIP_LEVY_CHECK_KEY = 'skipLevyCheck';

export const SkipLevyCheck = () =>
    SetMetadata(SKIP_LEVY_CHECK_KEY, true);
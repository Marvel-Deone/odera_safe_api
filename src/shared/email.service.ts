import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private readonly resend: Resend;

    constructor(private readonly config: ConfigService) {
        this.resend = new Resend(this.config.get<string>('RESEND_API_KEY'));
    }

    async sendPasswordResetOtpEmail(input: {
        toEmail: string;
        fullName?: string;
        otp: string;
    }) {
        const toEmail = input.toEmail?.trim();

        if (!toEmail) {
            return {
                accepted: false,
                status: 'SKIPPED',
                reason: 'No recipient email provided',
            };
        }

        const from = this.config.get<string>('RESEND_FROM_EMAIL')?.trim();

        if (!from) {
            return {
                accepted: false,
                status: 'SKIPPED',
                reason: 'RESEND_FROM_EMAIL not configured',
            };
        }

        const subject = 'Odera Safe • Password Reset OTP';

        const text = [
            `Hello ${input.fullName ?? 'there'},`,
            '',
            'We received a request to reset your Odera Safe password.',
            '',
            `Your password reset OTP is: ${input.otp}`,
            '',
            'This OTP will expire in 10 minutes.',
            'If you did not request a password reset, you can safely ignore this email.',
            '',
            'For your security, never share this OTP with anyone.',
        ].join('\n');

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Odera Safe Password Reset</title>
</head>

<body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">

<table
    role="presentation"
    width="100%"
    cellspacing="0"
    cellpadding="0"
    style="background:#f5f7fb;padding:40px 16px;"
>
    <tr>
        <td align="center">

            <table
                role="presentation"
                width="600"
                cellspacing="0"
                cellpadding="0"
                style="
                    background:#ffffff;
                    border-radius:16px;
                    overflow:hidden;
                    box-shadow:0 10px 30px rgba(0,0,0,.08);
                "
            >

                <!-- Header -->
                <tr>
                    <td
                        style="
                            background:#a41818;
                            padding:36px;
                            text-align:center;
                            color:#ffffff;
                        "
                    >
                        <h1 style="margin:0;font-size:30px;font-weight:700;">
                            Odera Safe
                        </h1>

                        <p style="margin-top:10px;font-size:16px;color:#f3dada;">
                            Password Reset
                        </p>
                    </td>
                </tr>

                <!-- Body -->
                <tr>
                    <td style="padding:40px;">

                        <p style="margin-top:0;font-size:18px;">
                            Hello <strong>${input.fullName ?? 'there'}</strong>,
                        </p>

                        <p style="line-height:1.7;color:#475569;">
                            We received a request to reset your
                            <strong>Odera Safe</strong> password.
                        </p>

                        <p style="line-height:1.7;color:#475569;">
                            Use the verification code below to continue.
                        </p>

                        <!-- OTP -->
                        <table
                            width="100%"
                            cellspacing="0"
                            cellpadding="0"
                            style="margin:32px 0;"
                        >
                            <tr>
                                <td
                                    align="center"
                                    style="
                                        background:#eef4ff;
                                        border:2px dashed #a41818;
                                        border-radius:12px;
                                        padding:28px;
                                    "
                                >
                                    <div
                                        style="
                                            font-size:38px;
                                            font-weight:700;
                                            letter-spacing:10px;
                                            color:#a41818;
                                        "
                                    >
                                        ${input.otp}
                                    </div>

                                    <div
                                        style="
                                            margin-top:10px;
                                            font-size:13px;
                                            color:#64748b;
                                        "
                                    >
                                        Password Reset OTP
                                    </div>
                                </td>
                            </tr>
                        </table>

                        <p
                            style="
                                text-align:center;
                                color:#64748b;
                                font-size:14px;
                            "
                        >
                            This OTP expires in <strong>10 minutes</strong>.
                        </p>

                        <table
                            width="100%"
                            cellspacing="0"
                            cellpadding="0"
                            style="margin-top:32px;"
                        >
                            <tr>
                                <td
                                    style="
                                        background:#f8fafc;
                                        border-left:4px solid #a41818;
                                        padding:20px;
                                        border-radius:8px;
                                    "
                                >
                                    <p
                                        style="
                                            margin:0;
                                            color:#475569;
                                            line-height:1.6;
                                        "
                                    >
                                        <strong>Security notice:</strong><br>
                                        Never share this OTP with anyone.
                                        Odera Safe will never ask you to share
                                        your verification code.
                                    </p>
                                </td>
                            </tr>
                        </table>

                        <p
                            style="
                                margin-top:32px;
                                line-height:1.7;
                                color:#475569;
                            "
                        >
                            If you did not request a password reset,
                            you can safely ignore this email.
                        </p>

                    </td>
                </tr>

                <!-- Footer -->
                <tr>
                    <td
                        style="
                            background:#f8fafc;
                            padding:24px;
                            text-align:center;
                            font-size:13px;
                            color:#64748b;
                        "
                    >
                        <p style="margin:0;">
                            © ${new Date().getFullYear()} Odera Safe
                        </p>

                        <p style="margin-top:8px;">
                            Making estates safer, smarter and connected.
                        </p>
                    </td>
                </tr>

            </table>

        </td>
    </tr>
</table>

</body>
</html>
`;

        try {
            const { data, error } = await this.resend.emails.send({
                from,
                to: toEmail,
                subject,
                text,
                html,
            });

            if (error) {
                this.logger.warn(
                    `Password reset email failed for ${toEmail}: ${error.message}`,
                );

                return {
                    accepted: false,
                    status: 'FAILED',
                    reason: error.message,
                };
            }

            return {
                accepted: true,
                status: 'SENT',
                provider: 'resend',
                recipient: toEmail,
                emailId: data?.id,
            };
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Unknown Resend error';

            this.logger.error(
                `Password reset email failed for ${toEmail}: ${message}`,
            );

            return {
                accepted: false,
                status: 'FAILED',
                reason: message,
            };
        }
    }

    async sendOnboardingActivationEmail(input: {
        toEmail: string;
        fullName?: string;
        houseNumber: string;
        activationCode: string;
        appDownloadLink: string;
    }) {
        const toEmail = input.toEmail?.trim();

        if (!toEmail) {
            return {
                accepted: false,
                status: 'SKIPPED',
                reason: 'No recipient email provided',
            };
        }

        const from = this.config.get<string>('RESEND_FROM_EMAIL')?.trim();

        if (!from) {
            return {
                accepted: false,
                status: 'SKIPPED',
                reason: 'RESEND_FROM_EMAIL not configured',
            };
        }

        const subject = 'Welcome to Odera Safe • Your Activation Code';

        const text = [
            `Hello ${input.fullName ?? 'there'},`,
            '',
            `Your Odera Safe activation code for house ${input.houseNumber} is ${input.activationCode}.`,
            `Download the app here: ${input.appDownloadLink}`,
            '',
            'Use this code to complete your onboarding.',
        ].join('\n');

        // const html = `
        //   <p>Hello ${input.fullName ?? 'there'},</p>
        //   <p>
        //     Your Odera Safe activation code for house
        //     <strong>${input.houseNumber}</strong> is
        //     <strong>${input.activationCode}</strong>.
        //   </p>
        //   <p>
        //     Download the app here:
        //     <a href="${input.appDownloadLink}">
        //       ${input.appDownloadLink}
        //     </a>
        //   </p>
        //   <p>Use this code to complete your onboarding.</p>
        // `

        const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Odera Safe Activation</title>
    </head>

    <body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
        Your Odera Safe activation code is ready. Complete your resident onboarding in just a few steps.
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fb;padding:40px 16px;">
    <tr>
    <td align="center">

    <table role="presentation" width="600" cellspacing="0" cellpadding="0"
    style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.08);">

    <!-- Header -->
    <tr>
    <td
    style="background:#a41818;padding:36px;text-align:center;color:#ffffff;">

    <h1 style="margin:0;font-size:30px;font-weight:700;">
    Odera Safe
    </h1>

    <p style="margin-top:10px;font-size:16px;color:#cbd5e1;">
    Resident Activation
    </p>

    </td>
    </tr>

    <!-- Body -->
    <tr>
    <td style="padding:40px;">

<p style="margin-top:0;font-size:18px;">
    Hello <strong>${input.fullName ?? 'Resident'}</strong>,
</p>
<p style="line-height:1.7;color:#475569;">
Welcome to <strong>Odera Safe</strong>.
Your resident onboarding has been created successfully for house
<strong>${input.houseNumber}</strong>.
</p>

<p style="line-height:1.7;color:#475569;">
Open the link below in your phone's browser to access the Odera Safe app.
You can then install it on your home screen for a native app experience.
</p>

<p style="line-height:1.7;color:#475569;">
Use the activation code below to complete your registration.
</p>

    <!-- Code -->

    <table width="100%" cellspacing="0" cellpadding="0"
    style="margin:32px 0;">
    <tr>
    <td align="center"
    style="
    background:#eef4ff;
    border:2px dashed #a41818;
    border-radius:12px;
    padding:28px;
    ">

    <div
    style="
    font-size:38px;
    font-weight:700;
    letter-spacing:10px;
    color:#a41818;
    ">
    ${input.activationCode}
    </div>

    <div
    style="
    margin-top:10px;
    font-size:13px;
    color:#64748b;
    ">
    Temporary Password
    </div>

    </td>
    </tr>
    </table>

    <!-- Button -->

    <table cellspacing="0" cellpadding="0" align="center">
    <tr>
    <td
    style="
    border-radius:8px;
    background:#a41818;
    ">
    <a
    href="${input.appDownloadLink}"
    style="
    display:inline-block;
    padding:16px 32px;
    font-size:16px;
    font-weight:bold;
    color:#ffffff;
    text-decoration:none;
    ">
    Open & Install App
    </a>
    </td>
    </tr>
    </table>

    <table width="100%" cellspacing="0" cellpadding="0" style="margin-top:36px;">
<tr>
<td
style="
background:#f8fafc;
border-left:4px solid #a41818;
padding:20px;
border-radius:8px;
">

<p style="margin-top:0;font-weight:bold;color:#1f2937;">
📱 Install Odera Safe on your phone
</p>

<p style="margin:12px 0;color:#475569;line-height:1.6;">
<strong>iPhone (Safari)</strong><br>
Tap the <strong>Share</strong> button, then select
<strong>Add to Home Screen</strong>.
</p>

<p style="margin:12px 0;color:#475569;line-height:1.6;">
<strong>Android (Chrome)</strong><br>
Tap the browser menu (⋮), then choose
<strong>Install App</strong> or
<strong>Add to Home Screen</strong>.
</p>

</td>
</tr>
</table>

    <p style="margin-top:40px;line-height:1.7;color:#475569;">
    For your security, never share this activation code with anyone.

Once you've opened the app, enter the code to activate your account.

If you weren't expecting this invitation, you can safely ignore this email.
    </p>

    </td>
    </tr>

    <!-- Footer -->

    <tr>
    <td
    style="
    background:#f8fafc;
    padding:24px;
    text-align:center;
    font-size:13px;
    color:#64748b;
    ">

    <p style="margin:0;">
    © ${new Date().getFullYear()} Odera Safe
    </p>

    <p style="margin-top:8px;">
    Making estates safer, smarter and connected.
    </p>

    </td>
    </tr>

    </table>

    </td>
    </tr>
    </table>

    </body>
    </html>
    `;

        try {
            const { data, error } = await this.resend.emails.send({
                from,
                to: toEmail,
                subject,
                text,
                html,
            });

            if (error) {
                this.logger.warn(
                    `Email delivery failed for ${toEmail}: ${error.message}`,
                );

                return {
                    accepted: false,
                    status: 'FAILED',
                    reason: error.message,
                };
            }

            return {
                accepted: true,
                status: 'SENT',
                provider: 'resend',
                recipient: toEmail,
                emailId: data?.id,
            };
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Unknown Resend error';

            this.logger.error(
                `Email delivery failed for ${toEmail}: ${message}`,
            );

            return {
                accepted: false,
                status: 'FAILED',
                reason: message,
            };
        }
    }

    async sendCoResidentWelcomeEmail(input: {
        toEmail: string;
        fullName?: string;
        temporaryPassword: string;
        appLoginLink: string;
    }) {
        const toEmail = input.toEmail?.trim();

        if (!toEmail) {
            return {
                accepted: false,
                status: 'SKIPPED',
                reason: 'No recipient email provided',
            };
        }

        const from = this.config.get<string>('RESEND_FROM_EMAIL')?.trim();

        if (!from) {
            return {
                accepted: false,
                status: 'SKIPPED',
                reason: 'RESEND_FROM_EMAIL not configured',
            };
        }

        const subject = 'Welcome to Odera Safe';
        const text = [
            `Hello ${input.fullName ?? 'there'},`,
            '',
            'A co-resident account has been created for you on Odera Safe.',
            `Email: ${toEmail}`,
            `Temporary password: ${input.temporaryPassword}`,
            `Open the app and log in here: ${input.appLoginLink}`,
            '',
            'You will be asked to change this password after your first login.',
        ].join('\n');

        const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Odera Safe Co-resident Welcome</title>
    </head>
    <body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f5f7fb;padding:40px 16px;">
    <tr>
    <td align="center">
    <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.08);">
    <tr>
    <td style="background:#a41818;padding:32px;text-align:center;color:#ffffff;">
    <h1 style="margin:0;font-size:28px;font-weight:700;">Odera Safe</h1>
    <p style="margin-top:10px;font-size:16px;color:#f3dada;">Co-resident Account</p>
    </td>
    </tr>
    <tr>
    <td style="padding:40px;">
    <p style="margin-top:0;font-size:18px;">Hello <strong>${input.fullName ?? 'there'}</strong>,</p>
    <p style="line-height:1.7;color:#475569;">
    A co-resident account has been created for you on <strong>Odera Safe</strong>.
    Use the temporary password below to log in.
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:28px 0;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;">
    <tr>
    <td style="padding:24px;">
    <p style="margin:0 0 10px;color:#64748b;font-size:14px;">Email</p>
    <p style="margin:0 0 20px;font-size:18px;color:#0f172a;"><strong>${toEmail}</strong></p>
    <p style="margin:0 0 10px;color:#64748b;font-size:14px;">Temporary password</p>
    <p style="margin:0;font-size:24px;color:#a41818;"><strong>${input.temporaryPassword}</strong></p>
    </td>
    </tr>
    </table>
    <table cellspacing="0" cellpadding="0" align="center">
    <tr>
    <td style="border-radius:8px;background:#a41818;">
    <a href="${input.appLoginLink}" style="display:inline-block;padding:16px 32px;font-size:16px;font-weight:bold;color:#ffffff;text-decoration:none;">Open App</a>
    </td>
    </tr>
    </table>
    <p style="margin-top:32px;line-height:1.7;color:#475569;">
    You will be asked to change this password after your first login. No extra account setup is required.
    </p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>
    `;

        try {
            const { data, error } = await this.resend.emails.send({
                from,
                to: toEmail,
                subject,
                text,
                html,
            });

            if (error) {
                this.logger.warn(
                    `Co-resident email delivery failed for ${toEmail}: ${error.message}`,
                );

                return {
                    accepted: false,
                    status: 'FAILED',
                    reason: error.message,
                };
            }

            return {
                accepted: true,
                status: 'SENT',
                provider: 'resend',
                recipient: toEmail,
                emailId: data?.id,
            };
        } catch (error) {
            const message =
                error instanceof Error ? error.message : 'Unknown Resend error';

            this.logger.error(
                `Co-resident email delivery failed for ${toEmail}: ${message}`,
            );

            return {
                accepted: false,
                status: 'FAILED',
                reason: message,
            };
        }
    }

    async sendGuardOnboardingActivationEmail(input: {
        toEmail: string;
        fullName?: string;
        estate: string;
        activationCode: string;
        appDownloadLink: string;
    }) {
        const toEmail = input.toEmail?.trim();

        if (!toEmail) {
            return {
                accepted: false,
                status: 'SKIPPED',
                reason: 'No recipient email provided',
            };
        }

        const from = this.config.get<string>('RESEND_FROM_EMAIL')?.trim();

        if (!from) {
            return {
                accepted: false,
                status: 'SKIPPED',
                reason: 'RESEND_FROM_EMAIL not configured',
            };
        }

        const subject = 'Welcome to Odera Safe • Guard Activation Code';

        const text = [
            `Hello ${input.fullName ?? 'there'},`,
            '',
            `Your Odera Safe guard activation code for ${input.activationCode} estate.`,
            `Open and install the Odera Safe app here: ${input.appDownloadLink}`,
            '',
            'Use this code to complete your guard onboarding.',
            '',
            'For your security, never share this activation code with anyone.',
        ].join('\n');

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Odera Safe Guard Activation</title>
</head>

<body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">

<div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    Your Odera Safe guard activation code is ready. Complete your onboarding in just a few steps.
</div>

<table role="presentation" width="100%" cellspacing="0" cellpadding="0"
    style="background:#f5f7fb;padding:40px 16px;">
<tr>
<td align="center">

<table role="presentation" width="600" cellspacing="0" cellpadding="0"
    style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.08);">

<!-- Header -->
<tr>
<td style="background:#a41818;padding:36px;text-align:center;color:#ffffff;">

<h1 style="margin:0;font-size:30px;font-weight:700;">
    Odera Safe
</h1>

<p style="margin-top:10px;font-size:16px;color:#ffffff;">
    Guard Activation
</p>

</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:40px;">

<p style="margin-top:0;font-size:18px;">
    Hello <strong>${input.fullName ?? 'Guard'}</strong>,
</p>

<p style="line-height:1.7;color:#475569;">
    Welcome to <strong>Odera Safe</strong>.
    Your guard onboarding has been created successfully for house
    <strong>${input.estate}</strong>.
</p>

<p style="line-height:1.7;color:#475569;">
    Open the link below in your phone's browser to access the
    Odera Safe app. You can then install it on your home screen
    for a native app experience.
</p>

<p style="line-height:1.7;color:#475569;">
    Use the activation code below to complete your guard registration
    and access the Odera Safe security platform.
</p>

<!-- Code -->
<table width="100%" cellspacing="0" cellpadding="0" style="margin:32px 0;">
<tr>
<td align="center"
    style="
        background:#eef4ff;
        border:2px dashed #a41818;
        border-radius:12px;
        padding:28px;
    ">

<div style="
    font-size:38px;
    font-weight:700;
    letter-spacing:10px;
    color:#a41818;
">
    ${input.activationCode}
</div>

<div style="
    margin-top:10px;
    font-size:13px;
    color:#64748b;
">
    Guard Activation Code
</div>

</td>
</tr>
</table>

<!-- Button -->
<table cellspacing="0" cellpadding="0" align="center">
<tr>
<td style="
    border-radius:8px;
    background:#a41818;
">

<a
    href="${input.appDownloadLink}"
    style="
        display:inline-block;
        padding:16px 32px;
        font-size:16px;
        font-weight:bold;
        color:#ffffff;
        text-decoration:none;
    "
>
    Open & Install App
</a>

</td>
</tr>
</table>

<!-- Installation Instructions -->
<table width="100%" cellspacing="0" cellpadding="0" style="margin-top:36px;">
<tr>
<td style="
    background:#f8fafc;
    border-left:4px solid #a41818;
    padding:20px;
    border-radius:8px;
">

<p style="margin-top:0;font-weight:bold;color:#1f2937;">
    📱 Install Odera Safe on your phone
</p>

<p style="margin:12px 0;color:#475569;line-height:1.6;">
    <strong>iPhone (Safari)</strong><br>
    Tap the <strong>Share</strong> button, then select
    <strong>Add to Home Screen</strong>.
</p>

<p style="margin:12px 0;color:#475569;line-height:1.6;">
    <strong>Android (Chrome)</strong><br>
    Tap the browser menu (⋮), then choose
    <strong>Install App</strong> or <strong>Add to Home Screen</strong>.
</p>

</td>
</tr>
</table>

<!-- Security Notice -->
<table width="100%" cellspacing="0" cellpadding="0" style="margin-top:28px;">
<tr>
<td style="
    background:#fff7ed;
    border-left:4px solid #f97316;
    padding:20px;
    border-radius:8px;
">

<p style="margin:0 0 10px;font-weight:bold;color:#9a3412;">
    🔐 Security Notice
</p>

<p style="margin:0;color:#475569;line-height:1.6;">
    Your activation code is private and should never be shared with
    residents, visitors, or anyone else. Use it only to activate your
    Odera Safe guard account.
</p>

</td>
</tr>
</table>

<p style="margin-top:32px;line-height:1.7;color:#475569;">
    Once you've opened the app, enter the activation code to activate
    your account and complete your onboarding.
</p>

<p style="line-height:1.7;color:#475569;">
    If you weren't expecting this invitation, you can safely ignore
    this email.
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="
    background:#f8fafc;
    padding:24px;
    text-align:center;
    font-size:13px;
    color:#64748b;
">

<p style="margin:0;">
    © ${new Date().getFullYear()} Odera Safe
</p>

<p style="margin-top:8px;">
    Making estates safer, smarter and connected.
</p>

</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`;

        try {
            const { data, error } = await this.resend.emails.send({
                from,
                to: toEmail,
                subject,
                text,
                html,
            });

            if (error) {
                this.logger.warn(
                    `Guard email delivery failed for ${toEmail}: ${error.message}`,
                );

                return {
                    accepted: false,
                    status: 'FAILED',
                    reason: error.message,
                };
            }

            return {
                accepted: true,
                status: 'SENT',
                provider: 'resend',
                recipient: toEmail,
                emailId: data?.id,
            };
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : 'Unknown Resend error';

            this.logger.error(
                `Guard email delivery failed for ${toEmail}: ${message}`,
            );

            return {
                accepted: false,
                status: 'FAILED',
                reason: message,
            };
        }
    }
}

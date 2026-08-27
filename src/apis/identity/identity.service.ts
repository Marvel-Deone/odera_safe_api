import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ClientService } from '../../shared/client/client.service';

type NinVerificationInput = {
  idNumber: string;
  firstname: string;
  lastname: string;
};

const getErrorMessage = (err: unknown, fallback = 'Unknown error') =>
  err instanceof Error
    ? err.message
    : (err as { message?: string })?.message || fallback;

const getErrorData = (err: unknown) =>
  (err as { response?: { data?: any }; data?: any })?.response?.data ||
  (err as { response?: { data?: any }; data?: any })?.data;

const getResponseMessage = (err: unknown) =>
  (err as { response?: { data?: { message?: string } } })?.response?.data
    ?.message;

const getResponseStatus = (
  err: unknown,
  fallback = HttpStatus.INTERNAL_SERVER_ERROR,
) =>
  (err as {
    response?: {
      status?: number;
      data?: { statusCode?: number; status?: number };
    };
  })?.response?.status ||
  (err as {
    response?: {
      status?: number;
      data?: { statusCode?: number; status?: number };
    };
  })?.response?.data?.statusCode ||
  (err as {
    response?: {
      status?: number;
      data?: { statusCode?: number; status?: number };
    };
  })?.response?.data?.status ||
  fallback;

@Injectable()
export class IdentityService {
  private readonly qoreIdSecret = process.env.QORE_ID_SECRET_KEY;
  private readonly qoreIdClientId = process.env.QORE_ID_CLIENT_ID;
  private readonly qoreIdUrl = process.env.QORE_ID_BASE_URL;

  constructor(
    private readonly clientsService: ClientService,
  ) {}

  /**
   * Authenticate with QoreID and obtain an access token.
   */
  private async qoreIdLogin() {
    try {
      if (!this.qoreIdClientId || !this.qoreIdSecret || !this.qoreIdUrl) {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            status: 'error',
            title: 'Identity Configuration Error',
            message: 'QoreID configuration is missing.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const qoreIdInfo = {
        clientId: this.qoreIdClientId,
        secret: this.qoreIdSecret,
      };

      const loginHeaders = {
        'Content-Type': 'application/json',
      };

      return await this.clientsService.postUrl(
        `${this.qoreIdUrl}/token`,
        qoreIdInfo,
        loginHeaders,
      );
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      const statusCode = getResponseStatus(err);

      throw new HttpException(
        {
          statusCode,
          status: 'error',
          title: 'Login Failed',
          message:
            getResponseMessage(err) ||
            'An error occurred during QoreID login.',
          data: getErrorData(err) || getErrorMessage(err),
        },
        statusCode,
      );
    }
  }

  /**
   * Perform the actual NIN lookup against QoreID.
   *
   * This method deliberately knows nothing about Resident or Guard.
   * It only verifies an identity using NIN + first name + last name.
   */
  private async verifyNinWithQoreId(
    user: NinVerificationInput,
    accessToken: string,
  ) {
    try {
      if (!user.idNumber || !user.firstname || !user.lastname) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            status: 'error',
            title: 'NIN Verification Failed',
            message:
              'NIN, first name, and last name are required for identity matching',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!this.qoreIdUrl) {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            status: 'error',
            title: 'Identity Configuration Error',
            message: 'QoreID base URL is not configured.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      };

      return await this.clientsService.postUrl(
        `${this.qoreIdUrl}/v1/ng/identities/nin/${user.idNumber}`,
        {
          firstname: user.firstname,
          lastname: user.lastname,
        },
        headers,
      );
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      const statusCode = getResponseStatus(err, HttpStatus.BAD_GATEWAY);

      throw new HttpException(
        {
          statusCode,
          status: 'error',
          title: 'NIN Verification Failed',
          message:
            getResponseMessage(err) ||
            'An error occurred during NIN verification.',
          data: getErrorData(err),
        },
        statusCode,
      );
    }
  }

  /**
   * Public identity verification API used by ResidentService,
   * GuardService, and any future identity-consuming module.
   */
  async verifyNin(userData: NinVerificationInput) {
    try {
      if (
        !userData?.idNumber ||
        !userData?.firstname ||
        !userData?.lastname
      ) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            status: 'error',
            title: 'NIN Verification Failed',
            message:
              'NIN, first name, and last name are required for identity matching',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const qoreIdLogin = await this.qoreIdLogin();

      if (!qoreIdLogin?.accessToken) {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            status: 'error',
            title: 'Verification Failed',
            message: 'Failed to authenticate with QoreID',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const enquiry = await this.verifyNinWithQoreId(
        {
          idNumber: userData.idNumber,
          firstname: userData.firstname,
          lastname: userData.lastname,
        },
        qoreIdLogin.accessToken,
      );

      if (!enquiry) {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            status: 'error',
            title: 'Verification Failed',
            message: 'Failed to verify NIN with QoreID',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return enquiry;
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          status: 'error',
          title: 'NIN Verification Failed',
          message:
            getErrorData(err) ||
            getErrorMessage(err) ||
            'An error occurred while verifying NIN.',
          data: getErrorData(err) || getErrorMessage(err),
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

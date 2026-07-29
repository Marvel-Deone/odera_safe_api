import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ClientService {
    constructor (private readonly httpService: HttpService) { }

    async getUrl (url: string, headers: Record<string, string>, timeoutMs = 30000): Promise<any> {
        const response = await lastValueFrom(
            this.httpService.get<any>(url, { headers, timeout: timeoutMs }).pipe(
                map((response: AxiosResponse<any>) => response.data)
            )
        );
        return response;
    }

    async postUrl (url: string, data: any, headers: Record<string, string>, timeoutMs = 30000): Promise<any> {
        const response = await lastValueFrom(
            this.httpService.post<any>(url, data, { headers, timeout: timeoutMs }).pipe(
                map((response: AxiosResponse<any>) => response.data)
            )
        );
        return response;
    }

    async putUrl (url: string, data: any, headers: Record<string, string>, timeoutMs = 30000): Promise<any> {
        const response = await lastValueFrom(
            this.httpService.put<any>(url, data, { headers, timeout: timeoutMs }).pipe(
                map((response: AxiosResponse<any>) => response.data)
            )
        );
        return response;
    }
}

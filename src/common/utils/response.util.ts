import { HttpException, HttpStatus } from '@nestjs/common'

type StatusType = 'success' | 'error'

export interface ApiResponse<T = any> {
    statusCode: number
    status: StatusType
    title?: string
    message?: string
    data?: T
    meta?: any
}

export const response = <T = any>(
    status: StatusType,
    title: string,
    message: string,
    code: number,
    data?: T,
    meta?: any,
): ApiResponse<T> => {
    return {
        statusCode: code,
        status,
        title,
        message,
        data,
        meta,
    }
}

export const success = <T = any>(
    data?: T,
    title = 'Success',
    message = 'Request successful',
    code = HttpStatus.OK,
    meta?: any,
): ApiResponse<T> => {
    return response('success', title, message, code, data, meta)
}

export const error = <T = any>(
    title = 'error',
    message = 'Request failed',
    code = HttpStatus.BAD_REQUEST,
    data: T | null = null,
): ApiResponse<T> => {
    const res = response('error', title, message, code, data)
    throw new HttpException(res, code)
}

// src/common/interfaces/response.interface.ts
export interface Response<T> {
    statusCode: number;
    message: string;
    data: T;
    success: boolean;
}

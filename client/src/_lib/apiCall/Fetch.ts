import Cookies from "js-cookie";

class FetchClient<TBaseResponse = any> {
    public baseURL: string;
    private token: string | null = null;
    private defaultHeaders: Record<string, string>;
    private requestInterceptor: ((config: RequestInit) => RequestInit | Promise<RequestInit>) | null;
    private responseInterceptor: (<T>(response: Response) => T | Promise<T>) | null;
    private responseErrorInterceptor: ((error: any) => void | Promise<void>) | null;

    constructor(baseURL: string, defaultHeaders: Record<string, string> = {}) {
        this.baseURL = baseURL;
        this.token = Cookies.get("token") || null;
        this.defaultHeaders = defaultHeaders;
        this.requestInterceptor = null;
        this.responseInterceptor = null;
        this.responseErrorInterceptor = null;
    }

    // Set additional headers
    setHeaders(headers: Record<string, string>) {
        this.defaultHeaders = { ...this.defaultHeaders, ...headers };
    }

    // Add a request interceptor
    setRequestInterceptor(interceptor: (config: RequestInit) => RequestInit | Promise<RequestInit>) {
        this.requestInterceptor = interceptor;
    }

    // Add a response interceptor
    setResponseInterceptor(
        interceptor: <T>(response: Response) => T | Promise<T>,
        errorInterceptor?: (error: any) => void | Promise<void>,
    ) {
        this.responseInterceptor = interceptor;
        this.responseErrorInterceptor = errorInterceptor || null;
    }

    // Core fetch logic
    private async request<TResponse = TBaseResponse, TRequest = any>(
        endpoint: string,
        options: RequestInit = {},
        body?: TRequest,
        formatDataForReq?: (data: TRequest) => TRequest,
        formatDataForRes?: (data: any) => TResponse,
    ): Promise<TResponse> {
        const url = `${this.baseURL}${endpoint}`;

        // Set Token if available
        if (this.token) {
            this.defaultHeaders = {
                ...this.defaultHeaders,
                Authorization: `Bearer ${this.token}`,
            };
        }

        // Merge headers
        options.headers = {
            ...this.defaultHeaders,
            ...(options.headers || {}),
        };

        // Format the request body if provided
        if (body) {
            const formattedBody = formatDataForReq ? formatDataForReq(body) : body;
            options.body = JSON.stringify(formattedBody);
            options.headers = {
                ...options.headers,
                "Content-Type": "application/json",
            };
        }

        try {
            // Apply request interceptor
            if (this.requestInterceptor) {
                options = await this.requestInterceptor(options);
            }

            // Perform the request
            const response = await fetch(url, options);

            // Apply response interceptor
            if (this.responseInterceptor) {
                const interceptorResult = await this.responseInterceptor<TResponse>(response);
                return formatDataForRes ? formatDataForRes(interceptorResult) : interceptorResult;
            }

            // Default behavior: parse JSON response
            if (!response.ok) {
                const errorResponse = await response.json().catch(() => null);
                throw new Error(`HTTP Error: ${response.status} - ${errorResponse?.message || response.statusText}`);
            }

            const responseData = await response.json();
            return formatDataForRes ? formatDataForRes(responseData) : (responseData as TResponse);
        } catch (error) {
            // Apply error interceptor if defined
            if (this.responseErrorInterceptor) {
                await this.responseErrorInterceptor(error);
            }
            throw error; // Rethrow after error handling
        }
    }

    // Shortcut methods for common HTTP methods
    get<TResponse = TBaseResponse>(
        endpoint: string,
        options: RequestInit = {},
        formatDataForRes?: (data: any) => TResponse,
    ) {
        return this.request<TResponse>(endpoint, { ...options, method: "GET" }, undefined, undefined, formatDataForRes);
    }

    post<TResponse = TBaseResponse, TRequest = any>(
        endpoint: string,
        body: TRequest,
        options: RequestInit = {},
        formatDataForReq?: (data: TRequest) => TRequest,
        formatDataForRes?: (data: any) => TResponse,
    ) {
        return this.request<TResponse, TRequest>(
            endpoint,
            { ...options, method: "POST" },
            body,
            formatDataForReq,
            formatDataForRes,
        );
    }

    put<TResponse = TBaseResponse, TRequest = any>(
        endpoint: string,
        body: TRequest,
        options: RequestInit = {},
        formatDataForReq?: (data: TRequest) => TRequest,
        formatDataForRes?: (data: any) => TResponse,
    ) {
        return this.request<TResponse, TRequest>(
            endpoint,
            { ...options, method: "PUT" },
            body,
            formatDataForReq,
            formatDataForRes,
        );
    }

    patch<TResponse = TBaseResponse, TRequest = any>(
        endpoint: string,
        body: TRequest,
        options: RequestInit = {},
        formatDataForReq?: (data: TRequest) => TRequest,
        formatDataForRes?: (data: any) => TResponse,
    ) {
        return this.request<TResponse, TRequest>(
            endpoint,
            { ...options, method: "PATCH" },
            body,
            formatDataForReq,
            formatDataForRes,
        );
    }

    delete<TResponse = TBaseResponse>(
        endpoint: string,
        options: RequestInit = {},
        formatDataForRes?: (data: any) => TResponse,
    ) {
        return this.request<TResponse>(
            endpoint,
            { ...options, method: "DELETE" },
            undefined,
            undefined,
            formatDataForRes,
        );
    }
}

export default FetchClient;

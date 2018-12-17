/// <reference types="node" />
import { IncomingMessage, OutgoingHttpHeaders, RequestOptions } from "http";
import { Transform } from "stream";
import { URL } from "url";
import { CancellationToken } from "./CancellationToken";
import { ProgressInfo } from "./ProgressCallbackTransform";
export interface RequestHeaders extends OutgoingHttpHeaders {
    [key: string]: string;
}
export interface DownloadOptions {
    readonly headers?: OutgoingHttpHeaders | null;
    readonly sha2?: string | null;
    readonly sha512?: string | null;
    readonly cancellationToken: CancellationToken;
    onProgress?(progress: ProgressInfo): void;
}
export declare function createHttpError(response: IncomingMessage, description?: any | null): HttpError;
export declare class HttpError extends Error {
    readonly statusCode: number;
    readonly description: any | null;
    constructor(statusCode: number, message?: string, description?: any | null);
}
export declare function parseJson(result: Promise<string | null>): Promise<any>;
export declare abstract class HttpExecutor<REQUEST> {
    protected readonly maxRedirects = 10;
    request(options: RequestOptions, cancellationToken?: CancellationToken, data?: {
        [name: string]: any;
    } | null): Promise<string | null>;
    doApiRequest(options: RequestOptions, cancellationToken: CancellationToken, requestProcessor: (request: REQUEST, reject: (error: Error) => void) => void, redirectCount?: number): Promise<string>;
    protected addRedirectHandlers(request: any, options: RequestOptions, reject: (error: Error) => void, redirectCount: number, handler: (options: RequestOptions) => void): void;
    addErrorAndTimeoutHandlers(request: any, reject: (error: Error) => void): void;
    private handleResponse;
    abstract createRequest(options: any, callback: (response: any) => void): any;
    downloadToBuffer(url: URL, options: DownloadOptions): Promise<Buffer>;
    protected doDownload(requestOptions: any, options: DownloadCallOptions, redirectCount: number): void;
    protected createMaxRedirectError(): Error;
    private addTimeOutHandler;
    static prepareRedirectUrlOptions(redirectUrl: string, options: RequestOptions): RequestOptions;
}
export interface DownloadCallOptions {
    responseHandler: ((response: IncomingMessage, callback: (error: Error | null) => void) => void) | null;
    onCancel: (callback: () => void) => void;
    callback: (error: Error | null) => void;
    options: DownloadOptions;
    destination: string | null;
}
export declare function configureRequestOptionsFromUrl(url: string, options: RequestOptions): RequestOptions;
export declare function configureRequestUrl(url: URL, options: RequestOptions): void;
export declare class DigestTransform extends Transform {
    readonly expected: string;
    private readonly algorithm;
    private readonly encoding;
    private readonly digester;
    private _actual;
    readonly actual: string | null;
    isValidateOnEnd: boolean;
    constructor(expected: string, algorithm?: string, encoding?: "hex" | "base64" | "latin1");
    _transform(chunk: Buffer, encoding: string, callback: any): void;
    _flush(callback: any): void;
    validate(): null;
}
export declare function safeGetHeader(response: any, headerKey: string): any;
export declare function configureRequestOptions(options: RequestOptions, token?: string | null, method?: "GET" | "DELETE" | "PUT"): RequestOptions;
export declare function safeStringifyJson(data: any, skippedNames?: Set<string>): string;

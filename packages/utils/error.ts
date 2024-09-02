import { isString } from './types';

class YibnError extends Error {
    constructor(m: string) {
        super(m);
        this.name = 'YibnError';
    }
}

export function throwError(scope: string, m: string):never {
    throw new YibnError(`[${scope}] ${m}`);
}

export function debugWarn(err: Error): void;
export function debugWarn(scope: string, message: string): void;
export function debugWarn(scope: string | Error, message?: string): void {
    if (process.env.NODE_ENV !== 'production') {
        const error: Error = isString(scope) ? new YibnError(`[${scope}] ${message}`) : scope;
        console.warn(error);
    }
}
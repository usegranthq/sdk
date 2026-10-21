import type { HTTPError } from 'ky';

import type { ProvidersGetError } from './generated/types.gen';

export type ApiError = ProvidersGetError;

export class UseGrantError extends Error {
  readonly status: number;
  readonly code: string | undefined;
  readonly data: unknown;
  readonly request: Request;
  readonly response: Response;

  constructor(error: HTTPError) {
    const body = typeof error.data === 'object' && error.data !== null ? (error.data as Partial<ApiError>) : undefined;
    super(body?.message ?? `Request failed with status code ${error.response.status}`, { cause: error });
    this.name = 'UseGrantError';
    this.status = error.response.status;
    this.code = body?.code;
    this.data = error.data;
    this.request = error.request;
    this.response = error.response;
  }
}

import { z } from 'zod';
import { RetryOptions } from 'ky';

import * as schema from './schema';

export type Provider = z.infer<typeof schema.ProviderSchema>;
export type Client = z.infer<typeof schema.ClientSchema>;
export type Token = z.infer<typeof schema.TokenSchema>;
export type Tenant = z.infer<typeof schema.TenantSchema>;
export type TenantProvider = z.infer<typeof schema.TenantProviderSchema>;
export type ValidateTokenResponse = z.infer<typeof schema.ValidateTokenResponseSchema>;
export type EmptyResponse = z.infer<typeof schema.EmptyResponseSchema>;
export type Domain = z.infer<typeof schema.DomainSchema>;

export interface UseGrantOptions {
  baseUrl: string;
  retry: RetryOptions;
  signal: AbortSignal;
}

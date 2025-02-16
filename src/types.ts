import { z } from 'zod';
import {
  createClientSchema,
  createProviderSchema,
  createTenantProviderSchema,
  createTenantSchema,
  createTokenSchema,
} from './schema';

export type CreateProviderReq = z.infer<typeof createProviderSchema>;
export type CreateClientReq = z.infer<typeof createClientSchema>;
export type CreateTokenReq = z.infer<typeof createTokenSchema>;
export type CreateTenantReq = z.infer<typeof createTenantSchema>;
export type CreateTenantProviderReq = z.infer<typeof createTenantProviderSchema>;

export interface Provider {
  id: string;
  name: string;
  description: string;
}

export interface Client {
  id: string;
  name: string;
  description: string;
}

export interface Token {
  accessToken: string;
  expiresAt: string;
  type: 'Bearer';
}

export interface Tenant {
  id: string;
  name: string;
  description: string;
}

export interface TenantProvider {
  id: string;
  url: string;
  fingerprints: string[];
  audience: string;
  earliestIssuanceTimeAllowed: number;
}

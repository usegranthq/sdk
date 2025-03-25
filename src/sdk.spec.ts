import { z } from 'zod';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import UseGrant from './index';
import * as Types from './types';
import * as schema from './schema';

// Mock ky instance
const mockJson = vi.fn();
const mockKyInstance = {
  post: vi.fn(() => ({ json: mockJson })),
  get: vi.fn(() => ({ json: mockJson })),
  delete: vi.fn(() => ({ json: mockJson })),
};

vi.mock('ky', () => {
  return {
    default: {
      create: vi.fn(() => mockKyInstance),
    },
  };
});

describe('SDK Initialization', () => {
  it('should initialize with API key', async () => {
    const ky = await import('ky');

    const sdk = new UseGrant('test-api-key');
    expect(sdk).toBeDefined();
    expect(ky.default.create).toHaveBeenCalledWith({
      prefixUrl: 'https://sdk.usegrant.dev',
      headers: {
        Authorization: 'Bearer test-api-key',
      },
    });
  });

  it('should initialize with custom options', async () => {
    const ky = await import('ky');
    const options = {
      baseUrl: 'https://custom.domain.com',
      signal: AbortSignal.timeout(1000),
      retry: {
        limit: 3,
        backoffLimit: 1000,
      },
    };

    const sdk = new UseGrant('test-api-key', options);
    expect(sdk).toBeDefined();
    expect(ky.default.create).toHaveBeenCalledWith({
      prefixUrl: options.baseUrl,
      headers: {
        Authorization: 'Bearer test-api-key',
      },
      signal: options.signal,
      retry: options.retry,
    });
  });

  it('should throw error if API key is not provided', () => {
    expect(() => new UseGrant('')).toThrow();
  });
});

describe('UseGrant SDK', () => {
  let sdk: UseGrant;
  const apiKey = 'test-api-key';

  beforeEach(() => {
    sdk = new UseGrant(apiKey);
    vi.clearAllMocks();
  });

  describe('Provider Operations', () => {
    const mockProvider: Types.Provider = {
      id: 'p-123',
      name: 'Test Provider',
      description: 'Test Provider Description',
      createdAt: '2024-12-31T23:59:59Z',
      updatedAt: '2024-12-31T23:59:59Z',
    };

    const createProviderReq = {
      name: 'Test Provider',
      description: 'Test Provider Description',
    };

    it('should create a provider', async () => {
      mockKyInstance.post.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve(mockProvider)),
      }));

      const result = await sdk.createProvider(createProviderReq);
      expect(result).toEqual(mockProvider);
      expect(mockKyInstance.post).toHaveBeenCalledWith('v1/providers', { json: createProviderReq });
    });

    it('should get a provider', async () => {
      mockKyInstance.get.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve(mockProvider)),
      }));

      const result = await sdk.getProvider('p-123');
      expect(result).toEqual(mockProvider);
      expect(mockKyInstance.get).toHaveBeenCalledWith('v1/providers/p-123');
    });

    it('should list all providers', async () => {
      mockKyInstance.get.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve([mockProvider])),
      }));

      const result = await sdk.listProviders();
      expect(result).toEqual([mockProvider]);
      expect(mockKyInstance.get).toHaveBeenCalledWith('v1/providers');
    });

    it('should delete a provider', async () => {
      mockKyInstance.delete.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve('')),
      }));

      const result = await sdk.deleteProvider('p-123');
      expect(result).toEqual('');
      expect(mockKyInstance.delete).toHaveBeenCalledWith('v1/providers/p-123');
    });
  });

  describe('Client Operations', () => {
    const mockClient: Types.Client = {
      id: 'client-123',
      name: 'Test Client',
      audience: 'sts.testaudience.com',
      createdAt: '2024-12-31T23:59:59Z',
      updatedAt: '2024-12-31T23:59:59Z',
    };

    const createClientReq = {
      name: 'Test Client',
      audience: 'sts.testaudience.com',
    };

    it('should create a client', async () => {
      mockKyInstance.post.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve(mockClient)),
      }));

      const result = await sdk.createClient('p-123', createClientReq);
      expect(result).toEqual(mockClient);
      expect(mockKyInstance.post).toHaveBeenCalledWith('v1/providers/p-123/clients', {
        json: createClientReq,
      });
    });

    it('should get a client', async () => {
      mockKyInstance.get.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve(mockClient)),
      }));

      const result = await sdk.getClient('p-123', 'client-123');
      expect(result).toEqual(mockClient);
      expect(mockKyInstance.get).toHaveBeenCalledWith('v1/providers/p-123/clients/client-123');
    });

    it('should list all clients', async () => {
      mockKyInstance.get.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve([mockClient])),
      }));

      const result = await sdk.listClients('p-123');
      expect(result).toEqual([mockClient]);
      expect(mockKyInstance.get).toHaveBeenCalledWith('v1/providers/p-123/clients');
    });

    it('should delete a client', async () => {
      mockKyInstance.delete.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve('')),
      }));

      const result = await sdk.deleteClient('p-123', 'client-123');
      expect(result).toEqual('');
      expect(mockKyInstance.delete).toHaveBeenCalledWith('v1/providers/p-123/clients/client-123');
    });
  });

  describe('Domain Operations', () => {
    const mockDomain: Types.Domain = {
      id: 'domain-123',
      domain: 'test.com',
      verified: false,
      createdAt: '2024-12-31T23:59:59Z',
      updatedAt: '2024-12-31T23:59:59Z',
    };

    const createDomainReq = {
      domain: 'test.com',
    };

    it('should add a domain', async () => {
      mockKyInstance.post.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve(mockDomain)),
      }));

      const result = await sdk.addDomain('p-123', createDomainReq);
      expect(result).toEqual(mockDomain);
      expect(mockKyInstance.post).toHaveBeenCalledWith('v1/providers/p-123/domains', {
        json: createDomainReq,
      });
    });

    it('should get a domain', async () => {
      mockKyInstance.get.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve(mockDomain)),
      }));

      const result = await sdk.getDomain('p-123', 'domain-123');
      expect(result).toEqual(mockDomain);
      expect(mockKyInstance.get).toHaveBeenCalledWith('v1/providers/p-123/domains/domain-123');
    });

    it('should get all domains', async () => {
      mockKyInstance.get.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve([mockDomain])),
      }));

      const result = await sdk.listDomains('p-123');
      expect(result).toEqual([mockDomain]);
      expect(mockKyInstance.get).toHaveBeenCalledWith('v1/providers/p-123/domains');
    });

    it('should verify a domain', async () => {
      const domainResponse = {
        domain: mockDomain,
        verified: true,
        message: 'Domain verified',
      };

      mockKyInstance.post.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve(domainResponse)),
      }));

      const result = await sdk.verifyDomain('p-123', 'domain-123');
      expect(result).toEqual(domainResponse);
      expect(mockKyInstance.post).toHaveBeenCalledWith('v1/providers/p-123/domains/domain-123/verify');
    });

    it('should delete a domain', async () => {
      mockKyInstance.delete.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve('')),
      }));

      const result = await sdk.deleteDomain('p-123', 'domain-123');
      expect(result).toEqual('');
      expect(mockKyInstance.delete).toHaveBeenCalledWith('v1/providers/p-123/domains/domain-123');
    });
  });

  describe('Token Operations', () => {
    const mockToken: Types.Token = {
      accessToken: 'test-token',
      expiresAt: '2024-12-31T23:59:59Z',
      type: 'Bearer',
    };

    const createTokenReq = {
      expiresIn: 3600,
      useJwtType: false,
      audienceAsArray: false,
      forceDefaultDomain: false,
    };

    it('should create a token', async () => {
      mockKyInstance.post.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve(mockToken)),
      }));

      const result = await sdk.createToken('p-123', 'client-123', createTokenReq);
      expect(result).toEqual(mockToken);
      expect(mockKyInstance.post).toHaveBeenCalledWith('v1/providers/p-123/clients/client-123/tokens', {
        json: createTokenReq,
      });
    });
  });

  describe('Tenant Operations', () => {
    const mockTenant: Types.Tenant = {
      id: 'tenant-123',
      name: 'Test Tenant',
      description: 'Test Tenant Description',
      createdAt: '2024-12-31T23:59:59Z',
      updatedAt: '2024-12-31T23:59:59Z',
    };

    const createTenantReq = {
      name: 'Test Tenant',
      description: 'Test Tenant Description',
    };

    it('should create a tenant', async () => {
      mockKyInstance.post.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve(mockTenant)),
      }));

      const result = await sdk.createTenant(createTenantReq);
      expect(result).toEqual(mockTenant);
      expect(mockKyInstance.post).toHaveBeenCalledWith('v1/tenants', {
        json: createTenantReq,
      });
    });

    it('should get a tenant', async () => {
      mockKyInstance.get.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve(mockTenant)),
      }));

      const result = await sdk.getTenant('tenant-123');
      expect(result).toEqual(mockTenant);
      expect(mockKyInstance.get).toHaveBeenCalledWith('v1/tenants/tenant-123');
    });

    it('should list all tenants', async () => {
      mockKyInstance.get.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve([mockTenant])),
      }));

      const result = await sdk.listTenants();
      expect(result).toEqual([mockTenant]);
      expect(mockKyInstance.get).toHaveBeenCalledWith('v1/tenants');
    });

    it('should delete a tenant', async () => {
      mockKyInstance.delete.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve('')),
      }));

      const result = await sdk.deleteTenant('tenant-123');
      expect(result).toEqual('');
      expect(mockKyInstance.delete).toHaveBeenCalledWith('v1/tenants/tenant-123');
    });
  });

  describe('Tenant Provider Operations', () => {
    const mockTenantProvider: Types.TenantProvider = {
      id: 'provider-123',
      url: 'https://provider.com',
      fingerprints: ['fingerprint1', 'fingerprint2'],
      audience: 'test-audience',
      earliestIssuanceTimeAllowed: 12,
      createdAt: '2024-12-31T23:59:59Z',
      updatedAt: '2024-12-31T23:59:59Z',
    };

    const createTenantProviderReq = {
      url: 'https://provider.com',
      fingerprints: ['990F4193972F2BECF12DDEDA5237F9C952F20D9E', '110F4193972F2BECF12DDEDA5237F9C952F20D9E'],
      audience: 'test-audience',
      earliestIssuanceTimeAllowed: 12,
    };

    it('should create a tenant provider', async () => {
      mockKyInstance.post.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve(mockTenantProvider)),
      }));

      const result = await sdk.createTenantProvider('tenant-123', createTenantProviderReq);
      expect(result).toEqual(mockTenantProvider);
      expect(mockKyInstance.post).toHaveBeenCalledWith('v1/tenants/tenant-123/providers', {
        json: createTenantProviderReq,
      });
    });

    it('should get a tenant provider', async () => {
      mockKyInstance.get.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve(mockTenantProvider)),
      }));

      const result = await sdk.getTenantProvider('tenant-123', 'provider-123');
      expect(result).toEqual(mockTenantProvider);
      expect(mockKyInstance.get).toHaveBeenCalledWith('v1/tenants/tenant-123/providers/provider-123');
    });

    it('should list all tenant providers', async () => {
      mockKyInstance.get.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve([mockTenantProvider])),
      }));

      const result = await sdk.listTenantProviders('tenant-123');
      expect(result).toEqual([mockTenantProvider]);
      expect(mockKyInstance.get).toHaveBeenCalledWith('v1/tenants/tenant-123/providers');
    });

    it('should delete a tenant provider', async () => {
      mockKyInstance.delete.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve('')),
      }));

      const result = await sdk.deleteTenantProvider('tenant-123', 'provider-123');
      expect(result).toEqual('');
      expect(mockKyInstance.delete).toHaveBeenCalledWith('v1/tenants/tenant-123/providers/provider-123');
    });
  });

  describe('Tenant Provider Policy Operations', () => {
    const mockTenantProviderPolicy: Types.TenantProviderPolicy = {
      id: 'policy-123',
      name: 'Test Policy',
      description: 'Test Policy Description',
      audience: 'test-audience',
      conditions: [
        {
          key: 'test-key',
          operator: 'stringLike',
          value: 'test-value',
        },
      ],
      createdAt: '2024-12-31T23:59:59Z',
      updatedAt: '2024-12-31T23:59:59Z',
    };

    it('should create a tenant provider policy', async () => {
      const createTenantProviderPolicyReq: z.infer<typeof schema.CreateTenantProviderPolicySchema> = {
        name: 'Test Policy',
        description: 'Test Policy Description',
        audience: 'test-audience',
        conditions: [
          {
            key: 'test-key',
            operator: 'stringLike',
            value: 'test-value',
          },
        ],
      };

      mockKyInstance.post.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve(mockTenantProviderPolicy)),
      }));

      const result = await sdk.createTenantProviderPolicy('tenant-123', 'provider-123', createTenantProviderPolicyReq);
      expect(result).toEqual(mockTenantProviderPolicy);
      expect(mockKyInstance.post).toHaveBeenCalledWith('v1/tenants/tenant-123/providers/provider-123/policies', {
        json: createTenantProviderPolicyReq,
      });
    });

    it('should get a tenant provider policy', async () => {
      mockKyInstance.get.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve(mockTenantProviderPolicy)),
      }));

      const result = await sdk.getTenantProviderPolicy('tenant-123', 'provider-123', 'policy-123');
      expect(result).toEqual(mockTenantProviderPolicy);
      expect(mockKyInstance.get).toHaveBeenCalledWith(
        'v1/tenants/tenant-123/providers/provider-123/policies/policy-123',
      );
    });

    it('should get all tenant provider policies', async () => {
      mockKyInstance.get.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve([mockTenantProviderPolicy])),
      }));

      const result = await sdk.listTenantProviderPolicies('tenant-123', 'provider-123');
      expect(result).toEqual([mockTenantProviderPolicy]);
      expect(mockKyInstance.get).toHaveBeenCalledWith('v1/tenants/tenant-123/providers/provider-123/policies');
    });

    it('should delete a tenant provider policy', async () => {
      mockKyInstance.delete.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve('')),
      }));

      const result = await sdk.deleteTenantProviderPolicy('tenant-123', 'provider-123', 'policy-123');
      expect(mockKyInstance.delete).toHaveBeenCalledWith(
        'v1/tenants/tenant-123/providers/provider-123/policies/policy-123',
      );
      expect(result).toEqual('');
    });
  });

  describe('Token Validation', () => {
    const mockToken = '1234567890';

    it('should validate a token', async () => {
      const mockData = { exp: 1715145600 };
      mockKyInstance.post.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve(mockData)),
      }));

      const result = await sdk.validateToken('tenant-123', 'tenant-provider-policy-123', mockToken);
      expect(result).toEqual(mockData);
      expect(mockKyInstance.post).toHaveBeenCalledWith('v1/tenants/tenant-123/validate', {
        json: { token: mockToken, tenantProviderPolicyId: 'tenant-provider-policy-123' },
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors', async () => {
      const errorResponse = new Error('API Error');
      mockKyInstance.get.mockImplementation(() => ({
        json: vi.fn(() => Promise.reject(errorResponse)),
      }));

      await expect(sdk.getProvider('p-123')).rejects.toThrow('API Error');
    });

    it('should handle network errors', async () => {
      const networkError = new Error('Network Error');
      mockKyInstance.get.mockImplementation(() => {
        throw networkError;
      });

      await expect(sdk.getProvider('p-123')).rejects.toThrow('Network Error');
    });

    it('should handle invalid JSON responses', async () => {
      mockKyInstance.get.mockImplementation(() => ({
        json: vi.fn(() => {
          throw new Error('Invalid JSON');
        }),
      }));

      await expect(sdk.getProvider('p-123')).rejects.toThrow('Invalid JSON');
    });
  });
});

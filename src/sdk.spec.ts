import { describe, it, expect, beforeEach, vi } from 'vitest';
import UseGrant from './index';
import * as Types from './types';

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

    it('should delete a provider', async () => {
      mockKyInstance.delete.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve({})),
      }));

      await sdk.deleteProvider('p-123');
      expect(mockKyInstance.delete).toHaveBeenCalledWith('v1/providers/p-123');
    });
  });

  describe('Client Operations', () => {
    const mockClient: Types.Client = {
      id: 'client-123',
      name: 'Test Client',
      audience: 'sts.testaudience.com',
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

    it('should delete a client', async () => {
      mockKyInstance.delete.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve({})),
      }));

      await sdk.deleteClient('p-123', 'client-123');
      expect(mockKyInstance.delete).toHaveBeenCalledWith('v1/providers/p-123/clients/client-123');
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

    it('should delete a tenant', async () => {
      mockKyInstance.delete.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve({})),
      }));

      await sdk.deleteTenant('tenant-123');
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

    it('should delete a tenant provider', async () => {
      mockKyInstance.delete.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve({})),
      }));

      await sdk.deleteTenantProvider('tenant-123', 'provider-123');
      expect(mockKyInstance.delete).toHaveBeenCalledWith('v1/tenants/tenant-123/providers/provider-123');
    });
  });

  describe('Token Validation', () => {
    const mockToken = '1234567890';

    it('should validate a token', async () => {
      const mockData = { exp: 1715145600 };
      mockKyInstance.post.mockImplementation(() => ({
        json: vi.fn(() => Promise.resolve(mockData)),
      }));

      const result = await sdk.validateToken('tenant-123', mockToken);
      expect(result).toEqual(mockData);
      expect(mockKyInstance.post).toHaveBeenCalledWith('v1/tenants/tenant-123/validate', {
        json: { token: mockToken },
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
  });
});

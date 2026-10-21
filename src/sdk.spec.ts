import { describe, it, expect, beforeEach, vi } from 'vitest';

import UseGrant, { client, createClient, UseGrantError } from './index';
import type * as Types from './generated/types.gen';

const fetchMock = vi.fn<typeof fetch>();
vi.stubGlobal('fetch', fetchMock);

let lastRequest: Request;

const respond = (body?: unknown, status = 200) => {
  fetchMock.mockImplementationOnce(async (input) => {
    // ky consumes the request body, keep a copy to assert on
    lastRequest = (input as Request).clone();
    return body === undefined ? new Response(null, { status }) : Response.json(body, { status });
  });
};

const timestamps = {
  createdAt: '2024-12-31T23:59:59Z',
  updatedAt: '2024-12-31T23:59:59Z',
};

const mockProvider: Types.ProvidersGetResponse = {
  id: 'p-123',
  name: 'Test Provider',
  description: 'Test Provider Description',
  urlId: 'url-123',
  rotateJwks: false,
  ...timestamps,
};

const mockClient: Types.ProvidersClientsGetResponse = {
  id: 'client-123',
  name: 'Test Client',
  audience: 'test-audience',
  subject: 'subject-123',
  ...timestamps,
};

const mockToken: Types.ProvidersClientsTokensCreateResponse = {
  accessToken: 'access-token',
  type: 'Bearer',
  expiresAt: '2024-12-31T23:59:59Z',
};

const mockDomain: Types.ProvidersDomainsGetResponse = {
  id: 'domain-123',
  domain: 'test.com',
  verified: false,
  ...timestamps,
};

const mockDomainValidation: Types.ProvidersDomainsVerifyResponse = {
  domain: mockDomain,
  verified: true,
  message: 'Domain verified',
};

const mockTenant: Types.TenantsGetResponse = {
  id: 'tenant-123',
  name: 'Test Tenant',
  description: 'Test Tenant Description',
  ...timestamps,
};

const mockTenantProvider: Types.TenantsProvidersGetResponse = {
  id: 'provider-123',
  url: 'https://test.com',
  fingerprints: ['a'.repeat(40)],
  audience: 'test-audience',
  earliestIssuanceTimeAllowed: 1,
  ...timestamps,
};

const mockTenantProviderPolicy: Types.TenantsProvidersPoliciesGetResponse = {
  id: 'policy-123',
  name: 'Test Policy',
  description: 'Test Policy Description',
  audience: 'test-audience',
  conditions: [{ key: 'sub', operator: 'stringEquals', value: 'test' }],
  ...timestamps,
};

describe('SDK Initialization', () => {
  beforeEach(() => {
    fetchMock.mockReset();
    client.setConfig({ auth: 'test-api-key', retry: { limit: 0 } });
  });

  it('should send requests to the default base url with the api key', async () => {
    const sdk = new UseGrant();
    respond([]);

    await sdk.providers.list();
    expect(lastRequest.url).toBe('https://sdk.usegrant.dev/v1/providers');
    expect(lastRequest.headers.get('Authorization')).toBe('Bearer test-api-key');
  });

  it('should support a client per instance', async () => {
    const sdk = new UseGrant({
      client: createClient({ ...client.getConfig(), auth: 'other-api-key', baseUrl: 'https://custom.domain.com' }),
    });
    respond({ defined: true, code: 'UNAUTHORIZED', status: 401, message: 'Unauthorized' }, 401);

    const error = await sdk.providers.list().catch((e: unknown) => e);
    expect(lastRequest.url).toBe('https://custom.domain.com/v1/providers');
    expect(lastRequest.headers.get('Authorization')).toBe('Bearer other-api-key');
    expect(error).toBeInstanceOf(UseGrantError);
  });
});

describe('UseGrant SDK', () => {
  let sdk: UseGrant;

  beforeEach(() => {
    fetchMock.mockReset();
    client.setConfig({ auth: 'test-api-key', retry: { limit: 0 } });
    sdk = new UseGrant();
  });

  const createProviderReq = { name: 'Test Provider', description: 'Test Provider Description' };
  const createClientReq = { name: 'Test Client', audience: 'test-audience' };
  const createTokenReq = { expiresIn: 600 };
  const addDomainReq = { domain: 'test.com' };
  const createTenantReq = { name: 'Test Tenant', description: 'Test Tenant Description' };
  const createTenantProviderReq = {
    url: 'https://test.com',
    fingerprints: ['a'.repeat(40)],
    audience: 'test-audience',
    earliestIssuanceTimeAllowed: 1,
  };
  const createTenantProviderPolicyReq = {
    name: 'Test Policy',
    description: 'Test Policy Description',
    audience: 'test-audience',
    conditions: [{ key: 'sub', operator: 'stringEquals' as const, value: 'test' }],
  };

  const cases: {
    name: string;
    call: () => Promise<{ data: unknown }>;
    method: string;
    path: string;
    body?: unknown;
    response?: unknown;
  }[] = [
    {
      name: 'listProviders',
      call: () => sdk.providers.list(),
      method: 'GET',
      path: 'v1/providers',
      response: [mockProvider],
    },
    {
      name: 'createProvider',
      call: () => sdk.providers.create(createProviderReq),
      method: 'POST',
      path: 'v1/providers',
      body: createProviderReq,
      response: mockProvider,
    },
    {
      name: 'getProvider',
      call: () => sdk.providers.get({ id: 'p-123' }),
      method: 'GET',
      path: 'v1/providers/p-123',
      response: mockProvider,
    },
    {
      name: 'deleteProvider',
      call: () => sdk.providers.delete({ id: 'p-123' }),
      method: 'DELETE',
      path: 'v1/providers/p-123',
    },
    {
      name: 'listClients',
      call: () => sdk.providers.clients.list({ providerId: 'p-123' }),
      method: 'GET',
      path: 'v1/providers/p-123/clients',
      response: [mockClient],
    },
    {
      name: 'createClient',
      call: () => sdk.providers.clients.create({ providerId: 'p-123', ...createClientReq }),
      method: 'POST',
      path: 'v1/providers/p-123/clients',
      body: createClientReq,
      response: { ...mockClient, providerId: 'p-123' },
    },
    {
      name: 'getClient',
      call: () => sdk.providers.clients.get({ providerId: 'p-123', clientId: 'client-123' }),
      method: 'GET',
      path: 'v1/providers/p-123/clients/client-123',
      response: mockClient,
    },
    {
      name: 'deleteClient',
      call: () => sdk.providers.clients.delete({ providerId: 'p-123', clientId: 'client-123' }),
      method: 'DELETE',
      path: 'v1/providers/p-123/clients/client-123',
    },
    {
      name: 'createToken',
      call: () =>
        sdk.providers.clients.tokens.create({ providerId: 'p-123', clientId: 'client-123', ...createTokenReq }),
      method: 'POST',
      path: 'v1/providers/p-123/clients/client-123/tokens',
      body: createTokenReq,
      response: mockToken,
    },
    {
      name: 'listDomains',
      call: () => sdk.providers.domains.list({ providerId: 'p-123' }),
      method: 'GET',
      path: 'v1/providers/p-123/domains',
      response: [mockDomain],
    },
    {
      name: 'addDomain',
      call: () => sdk.providers.domains.add({ providerId: 'p-123', ...addDomainReq }),
      method: 'POST',
      path: 'v1/providers/p-123/domains',
      body: addDomainReq,
      response: mockDomain,
    },
    {
      name: 'getDomain',
      call: () => sdk.providers.domains.get({ providerId: 'p-123', domainId: 'domain-123' }),
      method: 'GET',
      path: 'v1/providers/p-123/domains/domain-123',
      response: mockDomain,
    },
    {
      name: 'deleteDomain',
      call: () => sdk.providers.domains.delete({ providerId: 'p-123', domainId: 'domain-123' }),
      method: 'DELETE',
      path: 'v1/providers/p-123/domains/domain-123',
    },
    {
      name: 'verifyDomain',
      call: () => sdk.providers.domains.verify({ providerId: 'p-123', domainId: 'domain-123' }),
      method: 'POST',
      path: 'v1/providers/p-123/domains/domain-123/verify',
      response: mockDomainValidation,
    },
    { name: 'listTenants', call: () => sdk.tenants.list(), method: 'GET', path: 'v1/tenants', response: [mockTenant] },
    {
      name: 'createTenant',
      call: () => sdk.tenants.create(createTenantReq),
      method: 'POST',
      path: 'v1/tenants',
      body: createTenantReq,
      response: mockTenant,
    },
    {
      name: 'getTenant',
      call: () => sdk.tenants.get({ id: 'tenant-123' }),
      method: 'GET',
      path: 'v1/tenants/tenant-123',
      response: mockTenant,
    },
    {
      name: 'deleteTenant',
      call: () => sdk.tenants.delete({ id: 'tenant-123' }),
      method: 'DELETE',
      path: 'v1/tenants/tenant-123',
    },
    {
      name: 'listTenantProviders',
      call: () => sdk.tenants.providers.list({ tenantId: 'tenant-123' }),
      method: 'GET',
      path: 'v1/tenants/tenant-123/providers',
      response: [mockTenantProvider],
    },
    {
      name: 'createTenantProvider',
      call: () => sdk.tenants.providers.create({ tenantId: 'tenant-123', ...createTenantProviderReq }),
      method: 'POST',
      path: 'v1/tenants/tenant-123/providers',
      body: createTenantProviderReq,
      response: mockTenantProvider,
    },
    {
      name: 'getTenantProvider',
      call: () => sdk.tenants.providers.get({ tenantId: 'tenant-123', tenantProviderId: 'provider-123' }),
      method: 'GET',
      path: 'v1/tenants/tenant-123/providers/provider-123',
      response: mockTenantProvider,
    },
    {
      name: 'deleteTenantProvider',
      call: () => sdk.tenants.providers.delete({ tenantId: 'tenant-123', tenantProviderId: 'provider-123' }),
      method: 'DELETE',
      path: 'v1/tenants/tenant-123/providers/provider-123',
    },
    {
      name: 'listTenantProviderPolicies',
      call: () => sdk.tenants.providers.policies.list({ tenantId: 'tenant-123', tenantProviderId: 'provider-123' }),
      method: 'GET',
      path: 'v1/tenants/tenant-123/providers/provider-123/policies',
      response: [mockTenantProviderPolicy],
    },
    {
      name: 'createTenantProviderPolicy',
      call: () =>
        sdk.tenants.providers.policies.create({
          tenantId: 'tenant-123',
          tenantProviderId: 'provider-123',
          ...createTenantProviderPolicyReq,
        }),
      method: 'POST',
      path: 'v1/tenants/tenant-123/providers/provider-123/policies',
      body: createTenantProviderPolicyReq,
      response: mockTenantProviderPolicy,
    },
    {
      name: 'getTenantProviderPolicy',
      call: () =>
        sdk.tenants.providers.policies.get({
          tenantId: 'tenant-123',
          tenantProviderId: 'provider-123',
          policyId: 'policy-123',
        }),
      method: 'GET',
      path: 'v1/tenants/tenant-123/providers/provider-123/policies/policy-123',
      response: mockTenantProviderPolicy,
    },
    {
      name: 'deleteTenantProviderPolicy',
      call: () =>
        sdk.tenants.providers.policies.delete({
          tenantId: 'tenant-123',
          tenantProviderId: 'provider-123',
          policyId: 'policy-123',
        }),
      method: 'DELETE',
      path: 'v1/tenants/tenant-123/providers/provider-123/policies/policy-123',
    },
    {
      name: 'validateToken',
      call: () =>
        sdk.tenants.tokens.validate({
          tenantId: 'tenant-123',
          tenantProviderPolicyId: 'policy-123',
          token: 'jwt-token',
        }),
      method: 'POST',
      path: 'v1/tenants/tenant-123/validate',
      body: { tenantProviderPolicyId: 'policy-123', token: 'jwt-token' },
      response: { exp: 1715145600 },
    },
  ];

  it.each(cases)('$name', async ({ call, method, path, body, response }) => {
    respond(response, response === undefined ? 204 : 200);

    const { data } = await call();
    const request = lastRequest;

    expect(request.method).toBe(method);
    expect(request.url).toBe(`https://sdk.usegrant.dev/${path}`);
    expect(request.headers.get('Authorization')).toBe('Bearer test-api-key');
    if (body === undefined) {
      expect(await request.text()).toBe('');
    } else {
      expect(await request.json()).toEqual(body);
    }
    // 204 responses resolve with a null body
    expect(data ?? undefined).toEqual(response);
  });

  describe('Validation', () => {
    it('should reject invalid requests without calling the api', async () => {
      await expect(sdk.providers.create({ name: 'a', description: 'short' })).rejects.toThrow();
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it('should reject invalid responses', async () => {
      respond({ id: 'p-123' });
      await expect(sdk.providers.get({ id: 'p-123' })).rejects.toThrow();
    });
  });

  describe('Error Handling', () => {
    it('should throw UseGrantError for API errors', async () => {
      respond(
        {
          defined: true,
          code: 'PROVIDER_NOT_FOUND',
          status: 404,
          message: 'The specified provider could not be found',
        },
        404,
      );

      const error = await sdk.providers.get({ id: 'p-123' }).catch((e: unknown) => e);
      expect(error).toBeInstanceOf(UseGrantError);
      expect(error).toMatchObject({
        status: 404,
        code: 'PROVIDER_NOT_FOUND',
        message: 'The specified provider could not be found',
      });
    });

    it('should fall back to a generic message for non JSON errors', async () => {
      fetchMock.mockResolvedValueOnce(new Response('Bad Gateway', { status: 502 }));

      const error = await sdk.providers.get({ id: 'p-123' }).catch((e: unknown) => e);
      expect(error).toBeInstanceOf(UseGrantError);
      expect(error).toMatchObject({ status: 502, data: 'Bad Gateway', message: 'Request failed with status code 502' });
    });

    it('should rethrow network errors', async () => {
      fetchMock.mockRejectedValueOnce(new TypeError('Network Error'));
      await expect(sdk.providers.get({ id: 'p-123' })).rejects.toThrow('Network Error');
    });
  });
});

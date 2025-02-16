import ky, { KyInstance, RetryOptions, HTTPError } from 'ky';
import * as Types from './types';

const API_URL = 'https://sdk.usegrant.dev';

interface UseGrantOptions {
  retry?: RetryOptions;
}

export { HTTPError as UseGrantError };

class UseGrant {
  api: KyInstance;

  constructor(apiKey: string, options: UseGrantOptions = {}) {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    this.api = ky.create({
      prefixUrl: API_URL,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      retry: options.retry,
    });
  }

  createProvider(providerReqBody: Types.CreateProviderReq): Promise<Types.Provider> {
    return this.api.post<Types.Provider>('v1/providers', { json: providerReqBody }).json();
  }

  getProvider(providerId: string): Promise<Types.Provider> {
    return this.api.get<Types.Provider>(`v1/providers/${providerId}`).json();
  }

  deleteProvider(providerId: string): Promise<void> {
    return this.api.delete(`v1/providers/${providerId}`).json();
  }

  createClient(providerId: string, clientReqBody: Types.CreateClientReq): Promise<Types.Client> {
    return this.api.post<Types.Client>(`v1/providers/${providerId}/clients`, { json: clientReqBody }).json();
  }

  getClient(providerId: string, clientId: string): Promise<Types.Client> {
    return this.api.get<Types.Client>(`v1/providers/${providerId}/clients/${clientId}`).json();
  }

  deleteClient(providerId: string, clientId: string): Promise<void> {
    return this.api.delete(`v1/providers/${providerId}/clients/${clientId}`).json();
  }

  createToken(providerId: string, clientId: string, token: Types.CreateTokenReq): Promise<Types.Token> {
    return this.api.post<Types.Token>(`v1/providers/${providerId}/clients/${clientId}/tokens`, { json: token }).json();
  }

  createTenant(tenantReqBody: Types.CreateTenantReq): Promise<Types.Tenant> {
    return this.api.post<Types.Tenant>('v1/tenants', { json: tenantReqBody }).json();
  }

  getTenant(tenantId: string): Promise<Types.Tenant> {
    return this.api.get<Types.Tenant>(`v1/tenants/${tenantId}`).json();
  }

  deleteTenant(tenantId: string): Promise<void> {
    return this.api.delete(`v1/tenants/${tenantId}`).json();
  }

  createTenantProvider(tenantId: string, providerReqBody: Types.CreateTenantProviderReq): Promise<Types.Provider> {
    return this.api.post<Types.Provider>(`v1/tenants/${tenantId}/providers`, { json: providerReqBody }).json();
  }

  getTenantProvider(tenantId: string, providerId: string): Promise<Types.TenantProvider> {
    return this.api.get<Types.TenantProvider>(`v1/tenants/${tenantId}/providers/${providerId}`).json();
  }

  deleteTenantProvider(tenantId: string, providerId: string): Promise<void> {
    return this.api.delete(`v1/tenants/${tenantId}/providers/${providerId}`).json();
  }

  validateToken(tenantId: string, token: string): Promise<Types.Token> {
    return this.api.post<Types.Token>(`v1/tenants/${tenantId}/validate`, { json: { token } }).json();
  }
}

export default UseGrant;

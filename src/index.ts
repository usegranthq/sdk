import ky, { KyInstance, RetryOptions, HTTPError } from 'ky';
import * as Types from './types';
import * as schema from './schema';

const API_URL = 'https://sdk.usegrant.dev';

interface UseGrantOptions {
  retry?: RetryOptions;
}

export { HTTPError as UseGrantError };
export * from './types';

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

  getProviders = schema.GetProvidersFn.implement(() => {
    return this.api.get<Types.Provider[]>('v1/providers').json();
  });

  createProvider = schema.CreateProviderFn.implement((req) => {
    return this.api.post<Types.Provider>('v1/providers', { json: req }).json();
  });

  getProvider = schema.GetProviderFn.implement((id) => {
    return this.api.get<Types.Provider>(`v1/providers/${id}`).json();
  });

  deleteProvider = schema.DeleteProviderFn.implement((id) => {
    return this.api.delete(`v1/providers/${id}`).json();
  });

  getClients = schema.GetClientsFn.implement((providerId) => {
    return this.api.get<Types.Client[]>(`v1/providers/${providerId}/clients`).json();
  });

  createClient = schema.CreateClientFn.implement((providerId, req) => {
    return this.api.post<Types.Client>(`v1/providers/${providerId}/clients`, { json: req }).json();
  });

  getClient = schema.GetClientFn.implement((providerId, clientId) => {
    return this.api.get<Types.Client>(`v1/providers/${providerId}/clients/${clientId}`).json();
  });

  deleteClient = schema.DeleteClientFn.implement((providerId, clientId) => {
    return this.api.delete(`v1/providers/${providerId}/clients/${clientId}`).json();
  });

  createToken = schema.CreateTokenFn.implement((providerId, clientId, req) => {
    return this.api.post<Types.Token>(`v1/providers/${providerId}/clients/${clientId}/tokens`, { json: req }).json();
  });

  getTenants = schema.GetTenantsFn.implement(() => {
    return this.api.get<Types.Tenant[]>(`v1/tenants`).json();
  });

  createTenant = schema.CreateTenantFn.implement((req) => {
    return this.api.post<Types.Tenant>('v1/tenants', { json: req }).json();
  });

  getTenant = schema.GetTenantFn.implement((tenantId) => {
    return this.api.get<Types.Tenant>(`v1/tenants/${tenantId}`).json();
  });

  deleteTenant = schema.DeleteTenantFn.implement((tenantId) => {
    return this.api.delete(`v1/tenants/${tenantId}`).json();
  });

  getTenantProviders = schema.GetTenantProvidersFn.implement((tenantId) => {
    return this.api.get<Types.TenantProvider[]>(`v1/tenants/${tenantId}/providers`).json();
  });

  createTenantProvider = schema.CreateTenantProviderFn.implement((tenantId, req) => {
    return this.api.post<Types.Provider>(`v1/tenants/${tenantId}/providers`, { json: req }).json();
  });

  getTenantProvider = schema.GetTenantProviderFn.implement((tenantId, providerId) => {
    return this.api.get<Types.TenantProvider>(`v1/tenants/${tenantId}/providers/${providerId}`).json();
  });

  deleteTenantProvider = schema.DeleteTenantProviderFn.implement((tenantId, providerId) => {
    return this.api.delete(`v1/tenants/${tenantId}/providers/${providerId}`).json();
  });

  validateToken = schema.ValidateTokenFn.implement((tenantId, token) => {
    return this.api.post<Types.Token>(`v1/tenants/${tenantId}/validate`, { json: { token } }).json();
  });
}

export default UseGrant;

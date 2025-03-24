import ky, { KyInstance, RetryOptions, HTTPError } from 'ky';
import * as Types from './types';
import * as schema from './schema';

const API_URL = 'https://sdk.usegrant.dev';

export { HTTPError as UseGrantError };
export * from './types';

class UseGrant {
  #api: KyInstance;

  constructor(apiKey: string, options: Partial<Types.UseGrantOptions> = {}) {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    this.#api = ky.create({
      signal: options.signal,
      prefixUrl: options.baseUrl ?? API_URL,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      retry: options.retry,
    });
  }

  getProviders = schema.GetProvidersFn.implement(() => {
    return this.#api.get<Types.Provider[]>('v1/providers').json();
  });

  createProvider = schema.CreateProviderFn.implement((req) => {
    return this.#api.post<Types.Provider>('v1/providers', { json: req }).json();
  });

  getProvider = schema.GetProviderFn.implement((id) => {
    return this.#api.get<Types.Provider>(`v1/providers/${id}`).json();
  });

  deleteProvider = schema.DeleteProviderFn.implement((id) => {
    return this.#api.delete(`v1/providers/${id}`).json();
  });

  getClients = schema.GetClientsFn.implement((providerId) => {
    return this.#api.get<Types.Client[]>(`v1/providers/${providerId}/clients`).json();
  });

  createClient = schema.CreateClientFn.implement((providerId, req) => {
    return this.#api.post<Types.Client>(`v1/providers/${providerId}/clients`, { json: req }).json();
  });

  getClient = schema.GetClientFn.implement((providerId, clientId) => {
    return this.#api.get<Types.Client>(`v1/providers/${providerId}/clients/${clientId}`).json();
  });

  deleteClient = schema.DeleteClientFn.implement((providerId, clientId) => {
    return this.#api.delete<Types.EmptyResponse>(`v1/providers/${providerId}/clients/${clientId}`).json();
  });

  createToken = schema.CreateTokenFn.implement((providerId, clientId, req) => {
    return this.#api.post<Types.Token>(`v1/providers/${providerId}/clients/${clientId}/tokens`, { json: req }).json();
  });

  addDomain = schema.AddDomainFn.implement((providerId, req) => {
    return this.#api.post<Types.Domain>(`v1/providers/${providerId}/domains`, { json: req }).json();
  });

  deleteDomain = schema.DeleteDomainFn.implement((providerId, domainId) => {
    return this.#api.delete<Types.EmptyResponse>(`v1/providers/${providerId}/domains/${domainId}`).json();
  });

  getDomain = schema.GetDomainFn.implement((providerId, domainId) => {
    return this.#api.get<Types.Domain>(`v1/providers/${providerId}/domains/${domainId}`).json();
  });

  getDomains = schema.GetDomainsFn.implement((providerId) => {
    return this.#api.get<Types.Domain[]>(`v1/providers/${providerId}/domains`).json();
  });

  verifyDomain = schema.VerifyDomainFn.implement((providerId, domainId) => {
    return this.#api.post<Types.Domain>(`v1/providers/${providerId}/domains/${domainId}/verify`).json();
  });

  getTenants = schema.GetTenantsFn.implement(() => {
    return this.#api.get<Types.Tenant[]>(`v1/tenants`).json();
  });

  createTenant = schema.CreateTenantFn.implement((req) => {
    return this.#api.post<Types.Tenant>('v1/tenants', { json: req }).json();
  });

  getTenant = schema.GetTenantFn.implement((tenantId) => {
    return this.#api.get<Types.Tenant>(`v1/tenants/${tenantId}`).json();
  });

  deleteTenant = schema.DeleteTenantFn.implement((tenantId) => {
    return this.#api.delete<Types.EmptyResponse>(`v1/tenants/${tenantId}`).json();
  });

  getTenantProviders = schema.GetTenantProvidersFn.implement((tenantId) => {
    return this.#api.get<Types.TenantProvider[]>(`v1/tenants/${tenantId}/providers`).json();
  });

  createTenantProvider = schema.CreateTenantProviderFn.implement((tenantId, req) => {
    return this.#api.post<Types.Provider>(`v1/tenants/${tenantId}/providers`, { json: req }).json();
  });

  getTenantProvider = schema.GetTenantProviderFn.implement((tenantId, providerId) => {
    return this.#api.get<Types.TenantProvider>(`v1/tenants/${tenantId}/providers/${providerId}`).json();
  });

  deleteTenantProvider = schema.DeleteTenantProviderFn.implement((tenantId, providerId) => {
    return this.#api.delete<Types.EmptyResponse>(`v1/tenants/${tenantId}/providers/${providerId}`).json();
  });

  createTenantProviderPolicy = schema.CreateTenantProviderPolicyFn.implement((tenantId, providerId, req) => {
    return this.#api
      .post<Types.TenantProviderPolicy>(`v1/tenants/${tenantId}/providers/${providerId}/policies`, { json: req })
      .json();
  });

  getTenantProviderPolicies = schema.GetTenantProviderPoliciesFn.implement((tenantId, providerId) => {
    return this.#api
      .get<Types.TenantProviderPolicy[]>(`v1/tenants/${tenantId}/providers/${providerId}/policies`)
      .json();
  });

  getTenantProviderPolicy = schema.GetTenantProviderPolicyFn.implement((tenantId, providerId, policyId) => {
    return this.#api
      .get<Types.TenantProviderPolicy>(`v1/tenants/${tenantId}/providers/${providerId}/policies/${policyId}`)
      .json();
  });

  deleteTenantProviderPolicy = schema.DeleteTenantProviderPolicyFn.implement((tenantId, providerId, policyId) => {
    return this.#api
      .delete<Types.EmptyResponse>(`v1/tenants/${tenantId}/providers/${providerId}/policies/${policyId}`)
      .json();
  });

  validateToken = schema.ValidateTokenFn.implement((tenantId, policyId, token) => {
    return this.#api
      .post<Types.ValidateTokenResponse>(`v1/tenants/${tenantId}/validate`, {
        json: {
          tenantProviderPolicyId: policyId,
          token,
        },
      })
      .json();
  });
}

export default UseGrant;
